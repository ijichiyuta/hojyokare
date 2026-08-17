import "server-only";

import { Resend } from "resend";

import type { DeadlineResult } from "./subsidy/deadline";

// RESEND_API_KEY 未設定の間は送信をスキップする(チェッカーは動き続ける)。
// EMAIL_FROM は Resend で検証済みのドメインのアドレスを設定する。

const FROM_FALLBACK = "ホジョカレ <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const slash = (iso: string) => iso.replaceAll("-", "/");

function resultToText(result: DeadlineResult): string {
  const lines = [
    "ホジョカレ 報告期限チェッカーの計算結果です。",
    "",
    `補助金: ${result.program.subsidyName} ${result.program.roundLabel}`,
    `交付決定日: ${slash(result.input.koufuKetteiDate)} / 補助事業終了予定日: ${slash(result.input.shuuryouYoteiDate)} / 決算月: ${result.input.kessanMonth}月`,
    "",
    "■ 報告期限",
    ...result.items.map((i) => `・${i.label}: ${i.dueDateJa}`),
    "",
    `■ ${result.zaisanShobun.label}`,
    `・${result.zaisanShobun.periodJa}`,
    "",
    "※公表資料をもとに自動計算した目安です。事務局からの個別通知が優先されます。",
    "※各期限の30日前に、このメールアドレスへ無料アラートを1通お送りします(1案件のみ)。",
  ];
  return lines.join("\n");
}

/** 計算結果メールを送る。未設定・失敗でも throw しない */
export async function sendResultEmail(to: string, result: DeadlineResult): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? FROM_FALLBACK,
      to,
      subject: `【ホジョカレ】報告期限の計算結果(${result.program.subsidyName} ${result.program.roundLabel})`,
      text: resultToText(result),
    });
    if (error) {
      console.error("[email] 結果メール送信に失敗:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] 結果メール送信に失敗:", e);
    return false;
  }
}

/** 30日前アラートメールを送る。失敗時は false */
export async function sendAlertEmail(
  to: string,
  params: { subsidyName: string; roundLabel: string; label: string; dueDateJa: string },
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? FROM_FALLBACK,
      to,
      subject: `【ホジョカレ】${params.label}の期限まで30日です(${params.dueDateJa})`,
      text: [
        `${params.subsidyName} ${params.roundLabel} の「${params.label}」の期限が30日後に迫っています。`,
        "",
        `期限: ${params.dueDateJa}`,
        "",
        "必要書類の準備状況をご確認ください。",
        "※公表資料をもとに自動計算した目安です。事務局からの個別通知が優先されます。",
        "",
        "──",
        "段階リマインド(90/60/30/14/7日前・前日)や証憑の回収は有料版で提供しています。",
        "https://hojokare.jp",
      ].join("\n"),
    });
    if (error) {
      console.error("[email] アラート送信に失敗:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] アラート送信に失敗:", e);
    return false;
  }
}
