import Link from "next/link";

import { subsidyGroups } from "@/lib/subsidy/options";

import { CheckerForm } from "./checker-form";

const OUTPUTS = [
  {
    title: "実績報告の期限",
    body: "補助事業終了(予定)日から30日後と補助事業完了期限日の早い日で算出します。",
  },
  {
    title: "事業化状況報告(計6回分)",
    body: "事業再構築は決算日の3ヶ月後、ものづくりは毎年4/1〜5/31。初回から6回目まで一覧にします。",
  },
  {
    title: "財産処分制限期間",
    body: "取得財産の処分に制限がかかる期間の目安を表示します。",
  },
  {
    title: "30日前アラート",
    body: "各期限の30日前に、登録メールへ1通お送りします(1案件のみ)。",
  },
];

const STEPS = [
  { no: "1", label: "入力", active: true },
  { no: "2", label: "結果", active: false },
];

export default async function CheckerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const defaults = {
    program: first(sp.program),
    koufu: first(sp.koufu),
    kessan: first(sp.kessan),
  };

  return (
    <div className="mx-auto max-w-[1080px] px-10 pb-20 pt-10">
      <div className="mb-6 flex items-center gap-2.5 text-xs text-soft">
        <Link href="/" className="hover:text-navy">
          ホーム
        </Link>
        <span>／</span>
        <span className="text-ink">報告期限チェッカー</span>
      </div>

      <div className="grid grid-cols-[1fr_320px] items-start gap-7">
        <div className="rounded-md border border-line bg-white">
          <div className="border-b border-line px-8 py-[26px]">
            <div className="mb-2 text-[22px] font-bold">報告期限チェッカー</div>
            <p className="text-sm leading-[1.9] text-sub">
              交付決定日から、実績報告と事業化状況報告(計6回)の期限を計算します。
            </p>
          </div>

          <div className="flex items-center border-b border-line bg-surface px-8">
            {STEPS.map((st) => (
              <div key={st.no} className="flex items-center gap-2.5 py-3.5 pr-[22px]">
                <span
                  className={`flex size-[22px] items-center justify-center rounded-full text-[11px] font-bold ${
                    st.active ? "bg-navy text-white" : "bg-[#E4E8ED] text-soft"
                  }`}
                >
                  {st.no}
                </span>
                <span
                  className={`text-[13px] font-medium ${st.active ? "text-ink" : "text-soft"}`}
                >
                  {st.label}
                </span>
                <span className="ml-3 h-px w-8 bg-border-mid" />
              </div>
            ))}
          </div>

          <CheckerForm groups={subsidyGroups()} defaults={defaults} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-line bg-white px-6 py-[22px]">
            <div className="mb-4 text-sm font-bold">この画面でわかること</div>
            {OUTPUTS.map((o) => (
              <div key={o.title} className="border-t border-line-soft py-3">
                <div className="mb-1 text-[13px] font-medium">{o.title}</div>
                <div className="text-xs leading-[1.8] text-soft">{o.body}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-line bg-surface px-6 py-[22px]">
            <div className="mb-3 text-[13px] font-bold">計算のもとにしている資料</div>
            <div className="text-xs leading-8 text-sub">
              公募要領(各公募回)
              <br />
              補助事業の手引き・事務処理マニュアル
              <br />
              各補助金の公式サイト(事業化状況報告)
            </div>
            <p className="mt-3 border-t border-line-soft pt-3 text-[11px] leading-[1.8] text-mute">
              公表資料に基づく目安です。事務局からの個別通知が優先されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
