import { NextResponse } from "next/server";

import { findDueAlerts } from "@/lib/alerts";
import { getDb } from "@/lib/db";
import { emailEnabled, sendAlertEmail } from "@/lib/email";
import type { LeadRow } from "@/lib/leads";
import { todayJST } from "@/lib/status";

// 毎日 0:00 UTC(9:00 JST)に Vercel Cron から呼ばれる(vercel.json)。
// 各リードの期限のうち「今日からちょうど30日後」のものにアラートを1通送る。
// 送信済みは alert_logs で管理し、二重送信しない。

export async function GET(request: Request) {
  // Vercel Cron は Authorization: Bearer ${CRON_SECRET} を付与して呼び出す
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: false, reason: "database not configured" });
  }

  const { data: leads, error } = await db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1000);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 無料枠の制限: 1メールアドレスにつき最初に登録した1案件のみが対象
  const firstByEmail = new Map<string, LeadRow>();
  for (const lead of (leads ?? []) as LeadRow[]) {
    if (!firstByEmail.has(lead.email)) firstByEmail.set(lead.email, lead);
  }

  const today = todayJST();
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const lead of firstByEmail.values()) {
    let alerts;
    try {
      alerts = findDueAlerts(
        {
          programId: lead.program_id,
          koufuKetteiDate: lead.koufu_kettei_date,
          shuuryouYoteiDate: lead.shuuryou_yotei_date,
          kessanMonth: lead.kessan_month,
        },
        today,
      );
    } catch {
      skipped++; // マスタから外れた制度IDなど。計算不能はスキップ
      continue;
    }

    for (const alert of alerts) {
      const { data: existing } = await db
        .from("alert_logs")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("deadline_key", alert.deadlineKey)
        .maybeSingle();
      if (existing) continue;

      const ok = await sendAlertEmail(lead.email, alert);
      if (!ok) {
        failed++;
        continue;
      }
      await db.from("alert_logs").insert({
        lead_id: lead.id,
        deadline_key: alert.deadlineKey,
        due_date: alert.dueDate,
      });
      sent++;
    }
  }

  return NextResponse.json({
    ok: true,
    checked: firstByEmail.size,
    sent,
    failed,
    skipped,
    emailEnabled: emailEnabled(),
  });
}
