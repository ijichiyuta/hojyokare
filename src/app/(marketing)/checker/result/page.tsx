import Link from "next/link";

import { chipClass, dueStatus, periodStatus, todayJST } from "@/lib/status";
import { calcDeadlines, type DeadlineItem, type DeadlineResult } from "@/lib/subsidy/deadline";
import type { SourceRef } from "@/lib/subsidy/types";

const PAID_POINTS = [
  {
    title: "90/60/30/14/7/前日の段階通知",
    body: "LINEとメールに、やることと必要書類を添えて届きます。",
  },
  { title: "LINEで証憑を回収", body: "現場から送ってもらった書類が案件フォルダに自動で入ります。" },
  { title: "報告準備チェックリスト", body: "不足分だけをまとめて催促できます。" },
  { title: "5年保存", body: "報告書・証憑・通知履歴をまとめて保管・検索。" },
];

function firstParam(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function slash(iso: string): string {
  return iso.replaceAll("-", "/");
}

function DeadlineRow({
  label,
  dateJa,
  leftLabel,
  statusLabel,
  tone,
  note,
}: {
  label: string;
  dateJa: string;
  leftLabel: string;
  statusLabel: string;
  tone: keyof typeof chipClass;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[150px_1fr_130px_100px] items-center gap-4 border-b border-line-faint py-[13px]">
      <div className="text-[13px] text-sub">{label}</div>
      <div>
        <div className="tnum text-base font-medium tracking-[0.01em]">{dateJa}</div>
        {note ? <div className="mt-0.5 text-[11px] text-mute">{note}</div> : null}
      </div>
      <div className="tnum text-right text-[13px] text-sub">{leftLabel}</div>
      <div className="text-right">
        <span className={`rounded-[3px] border px-2 py-[3px] text-[11px] ${chipClass[tone]}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

function ReportRow({ item, today }: { item: DeadlineItem; today: ReturnType<typeof todayJST> }) {
  const st = dueStatus(today, item.dueDate);
  return (
    <DeadlineRow
      label={item.label}
      dateJa={item.dueDateJa}
      leftLabel={st.leftLabel}
      statusLabel={st.label}
      tone={st.tone}
    />
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-[720px] px-10 pb-20 pt-16">
      <div className="rounded-md border border-line bg-white p-8">
        <div className="mb-3 text-lg font-bold">計算できませんでした</div>
        <p className="mb-6 rounded border border-danger-line bg-danger-bg px-4 py-3 text-sm text-danger">
          {message}
        </p>
        <Link
          href="/checker"
          className="inline-block rounded bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-hover"
        >
          入力画面に戻る
        </Link>
      </div>
    </div>
  );
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const email = firstParam(sp.email);

  let result: DeadlineResult;
  try {
    result = calcDeadlines({
      programId: firstParam(sp.program),
      koufuKetteiDate: firstParam(sp.koufu),
      shuuryouYoteiDate: firstParam(sp.yotei),
      kessanMonth: Number(firstParam(sp.kessan)),
    });
  } catch (e) {
    return <ErrorCard message={e instanceof Error ? e.message : "入力内容を確認してください"} />;
  }

  const today = todayJST();
  const { input, program, jisseki, completionDeadline, jigyouka, zaisanShobun } = result;
  const isMonozukuri = program.subsidyName.includes("ものづくり");
  const zaisanSt = periodStatus(today, zaisanShobun.startDate, zaisanShobun.endDate);
  const completionSt = dueStatus(today, completionDeadline.dueDate);

  const conditions = [
    { label: "補助金", value: program.subsidyName },
    { label: "公募回", value: program.roundLabel },
    { label: "交付決定日", value: slash(input.koufuKetteiDate) },
    { label: "補助事業終了予定日", value: slash(input.shuuryouYoteiDate) },
    { label: "決算月", value: `${input.kessanMonth}月` },
  ];

  const sources: SourceRef[] = [];
  for (const s of [jisseki.source, jigyouka[0]?.source, zaisanShobun.source]) {
    if (s && !sources.some((x) => x.title === s.title && x.ref === s.ref)) sources.push(s);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-10 pb-20 pt-8">
      <div className="mb-5 flex items-center gap-2.5 text-xs text-soft">
        <Link href="/" className="hover:text-navy">
          ホーム
        </Link>
        <span>／</span>
        <Link href="/checker" className="hover:text-navy">
          報告期限チェッカー
        </Link>
        <span>／</span>
        <span className="text-ink">計算結果</span>
      </div>

      <div className="grid grid-cols-[1fr_320px] items-start gap-7">
        <div>
          <div className="mb-5 rounded-md border border-line bg-white">
            <div className="border-b border-line px-7 pb-5 pt-6">
              <div className="mb-1.5 text-[22px] font-bold">計算結果</div>
              <div className="text-[13px] text-sub">
                入力条件をもとに、報告・手続きの期限を算出しました。
              </div>
            </div>

            <div className="grid grid-cols-5 border-b border-line">
              {conditions.map((c) => (
                <div key={c.label} className="border-r border-line-soft px-5 py-4 last:border-r-0">
                  <div className="mb-1.5 text-[11px] text-soft">{c.label}</div>
                  <div className="tnum text-sm font-medium">{c.value}</div>
                </div>
              ))}
            </div>

            <div className="px-7 pb-6 pt-2">
              {/* 実績報告 */}
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2.5">
                  <div>
                    <span className="text-[15px] font-bold">実績報告</span>
                    <span className="ml-3 text-xs text-soft">{jisseki.note}</span>
                  </div>
                </div>
                <ReportRow item={jisseki} today={today} />
                <DeadlineRow
                  label={completionDeadline.label}
                  dateJa={completionDeadline.dueDateJa}
                  leftLabel={completionSt.leftLabel}
                  statusLabel={completionSt.label}
                  tone={completionSt.tone}
                  note={completionDeadline.note}
                />
              </div>

              {/* 事業化状況報告 */}
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2.5">
                  <div>
                    <span className="text-[15px] font-bold">事業化状況報告</span>
                    <span className="ml-3 text-xs text-soft">
                      {isMonozukuri
                        ? "初回+5年間・計6回。報告期間は毎年4月1日〜5月31日(初回は補助金受領月により前後)"
                        : "初回+5年間・計6回。毎年、決算日の3ヶ月後まで"}
                    </span>
                  </div>
                </div>
                {jigyouka.map((j) => (
                  <ReportRow key={j.key} item={j} today={today} />
                ))}
              </div>

              {/* 財産処分制限期間 */}
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2.5">
                  <div>
                    <span className="text-[15px] font-bold">{zaisanShobun.label}</span>
                    <span className="ml-3 text-xs text-soft">
                      取得財産等の処分が制限される期間(目安)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[150px_1fr_130px_100px] items-center gap-4 border-b border-line-faint py-[13px]">
                  <div className="text-[13px] text-sub">制限期間</div>
                  <div className="tnum text-base font-medium tracking-[0.01em]">
                    {zaisanShobun.periodJa}
                  </div>
                  <div className="tnum text-right text-[13px] text-sub">{zaisanSt.leftLabel}</div>
                  <div className="text-right">
                    <span
                      className={`rounded-[3px] border px-2 py-[3px] text-[11px] ${chipClass[zaisanSt.tone]}`}
                    >
                      {zaisanSt.label}
                    </span>
                  </div>
                </div>
                {zaisanShobun.note ? (
                  <div className="pt-2.5 text-[11px] leading-[1.8] text-mute">
                    {zaisanShobun.note}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* 計算の根拠 */}
          <div className="mb-5 rounded-md border border-line bg-white px-7 py-[22px]">
            <div className="mb-3.5 text-[13px] font-bold">計算の根拠</div>
            <div className="grid grid-cols-3 gap-5">
              {sources.map((s) => (
                <div key={`${s.title}-${s.ref}`} className="border-l-2 border-border-mid pl-3.5">
                  <div className="mb-1.5 text-[13px] font-medium leading-[1.7]">{s.title}</div>
                  <div className="tnum text-xs text-soft">{s.ref}</div>
                </div>
              ))}
            </div>
            <p className="mt-[18px] border-t border-line-soft pt-3.5 text-[11px] leading-[1.9] text-mute">
              公表資料をもとに自動計算した目安です。最新の要領・手引きおよび事務局からの通知が優先されます。実際の期限は交付申請書・事務局通知でご確認ください。
            </p>
          </div>

          <div className="flex gap-3">
            <span
              className="cursor-default rounded border border-border-input bg-white px-[22px] py-[13px] text-sm text-mute"
              title="準備中"
            >
              PDFで保存(準備中)
            </span>
            <span
              className="cursor-default rounded border border-border-input bg-white px-[22px] py-[13px] text-sm text-mute"
              title="準備中"
            >
              メールで送付(準備中)
            </span>
            <Link
              href="/#pricing"
              className="ml-auto rounded bg-navy px-[26px] py-[13px] text-sm font-medium text-white hover:bg-navy-hover"
            >
              LINEリマインドを設定する(有料版)
            </Link>
          </div>
          {email ? (
            <p className="mt-3 text-xs text-soft">
              30日前アラートの送付先: <span className="tnum">{email}</span>
              (送信機能は準備中です)
            </p>
          ) : null}
        </div>

        {/* サイドバー: 有料版アップセル */}
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-line bg-white px-6 py-[22px]">
            <div className="mb-1 text-sm font-bold">この先を有料版に任せる</div>
            <div className="mb-2 text-xs leading-[1.8] text-soft">
              無料アラートは30日前に1通、この案件のみです。
            </div>
            {PAID_POINTS.map((p) => (
              <div key={p.title} className="border-t border-line-soft py-3">
                <div className="mb-1 text-[13px] font-medium">{p.title}</div>
                <div className="text-xs leading-[1.8] text-soft">{p.body}</div>
              </div>
            ))}
            <div className="mt-2 border-t border-line-soft pt-[18px]">
              <div className="tnum flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold">9,800</span>
                <span className="text-[13px] text-sub">円 / 月・案件(税抜)</span>
              </div>
              <Link
                href="/#pricing"
                className="mt-3.5 block rounded bg-navy p-[13px] text-center text-sm font-medium text-white hover:bg-navy-hover"
              >
                料金プランを見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
