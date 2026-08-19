import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/footer";
import { subsidyGroups } from "@/lib/subsidy/options";

const STATS = [
  { value: "最長6年・7回", body: "実績報告1回と事業化状況報告6回の合計" },
  { value: "返還", body: "報告を怠った場合に生じうる措置" },
  { value: "Excelと記憶", body: "多くの採択企業の現在の管理方法" },
];

const STEPS = [
  {
    no: "STEP 1",
    title: "交付決定日を入れる",
    body: "補助金種別・公募回・交付決定日・決算月。入力は6項目、3分で終わります。",
  },
  {
    no: "STEP 2",
    title: "すべての期限が出る",
    body: "実績報告、事業化状況報告6回分、財産処分制限期間まで、根拠つきで一覧になります。",
  },
  {
    no: "STEP 3",
    title: "期限前に届く",
    body: "各期限の30日前に、無料アラートをメールで1通お届けします。有料版は90日前〜前日の段階通知と、不足書類の催促まで。",
  },
];

const FAQS = [
  {
    q: "期限を知るだけなら、カレンダーに入れれば十分では?",
    a: "その通りです。無料チェッカーの結果をそのままカレンダーに入れてください(PDFとメールでお渡しします)。有料版が引き受けるのは、その期限までに見積書・請求書・賃金台帳など数十点の証憑を社内から集め切る実務のほうです。",
  },
  {
    q: "どの補助金に対応していますか?",
    a: "事業再構築補助金(第6回〜第13回)と、ものづくり補助金(第13次〜第23次)に対応しています。対応制度は順次拡大していきます。",
  },
  {
    q: "計算される期限は正確ですか?",
    a: "公表されている公募要領・事務処理マニュアルに基づいて計算し、各期限に根拠となる資料名を表示します。ただしあくまで目安であり、交付決定通知書や事務局からの個別通知が優先されます。有料版では事務局通知に合わせた手動上書きができ、変更は履歴に残ります。",
  },
  {
    q: "報告書の作成代行はしてもらえますか?",
    a: "いいえ。ホジョカレは期限管理・書類整理のためのツールで、作成代行・申請代行は行いません。報告義務の履行責任および最終確認はご利用者にあります。",
  },
  {
    q: "無料アラートはいつ届きますか?",
    a: "各期限の30日前に、登録いただいたメールアドレスへ1通お届けします(1案件のみ)。有料版は90/60/30/14/7日前と前日に、LINEとメールで段階的に届きます。",
  },
  {
    q: "解約はいつでもできますか?",
    a: "はい、いつでも解約できます。解約は次回更新日をもって効力を生じ、日割返金はありません。",
  },
];

const FEATURES = [
  {
    tag: "証憑",
    title: "LINEで送るだけで、書類が集まる",
    body: "見積・発注・納品・検収・請求・振込・賃金台帳などに自動で仕分け。現場に送ってもらうだけで、案件フォルダに原本が無加工のまま保管されます。",
  },
  {
    tag: "報告準備",
    title: "何が足りないかだけを催促する",
    body: "報告回ごとの必要書類に対して、揃った／未収集を表示。不足分だけをまとめて担当者へ催促できます。期限を知ることではなく、書類を揃えることが報告の実務です。",
  },
  {
    tag: "5年保存",
    title: "翌年の報告は、前年の更新で終わる",
    body: "報告履歴と証憑が案件ごとに5年分たまるため、担当者が代わっても引き継げます。2年目以降は差分の入力が中心になります。",
  },
  {
    tag: "期限",
    title: "制度ごとの期限を自動で組み立てる",
    body: "公募回ごとのルールをマスタとして持ち、決算月の変更にも追随します。事務局の個別指示は手動で上書きでき、変更は履歴に残ります。",
  },
];

const PLANS = [
  {
    name: "チェッカー",
    for: "まず期限を知りたい方",
    price: "無料",
    unit: "",
    cta: "いますぐ使う",
    items: ["報告期限の自動算出(計7回分)", "PDF出力・メール送付", "30日前の無料アラート(1案件)"],
  },
  {
    name: "スタンダード",
    for: "採択企業の担当者向け",
    price: "9,800",
    unit: "円 / 月・案件",
    cta: "申し込む",
    items: [
      "証憑ボックスと自動仕分け(LINE)",
      "報告準備チェックリストと不足分の催促",
      "報告履歴を5年保存(翌年は前年更新)",
      "段階リマインド(LINE・メール)",
    ],
  },
  {
    name: "複数案件",
    for: "2案件目以降の追加分",
    price: "4,900",
    unit: "円 / 月・案件",
    cta: "申し込む",
    items: ["同一企業の追加採択案件", "スタンダードの全機能", "案件横断のダッシュボード"],
  },
  {
    name: "士業パートナー",
    for: "税理士・診断士・行政書士",
    price: "29,800",
    unit: "円 / 月",
    cta: "詳しく見る",
    items: [
      "顧問先20案件まで(超過 +1,200円)",
      "顧問先横断ダッシュボード",
      "事務所名で送る白ラベル通知",
      "一括CSV出力",
    ],
  },
];

const KESSAN_MONTHS = [3, 12, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];

export default function LandingPage() {
  const groups = subsidyGroups();
  return (
    <div>
      {/* ヒーロー */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_440px] items-start gap-[72px] px-10 pb-20 pt-[72px]">
          <div>
            <div className="mb-6 inline-block rounded-[3px] border border-amber-line bg-amber-bg px-2.5 py-[5px] text-xs tracking-[0.08em] text-amber-deep">
              事業再構築補助金／ものづくり補助金 対応
            </div>
            <h1 className="mb-6 text-[46px] font-bold leading-[1.4] tracking-[0.01em] [text-wrap:balance]">
              採択の6年後まで、
              <br />
              報告を落とさない。
            </h1>
            <p className="mb-8 max-w-[32em] text-base leading-loose text-sub">
              実績報告のあとも、事業化状況報告が5年間・計6回つづきます。期限の計算とアラートはずっと無料。有料版は、そのたびに発生する証憑集めと催促まで引き受けます。
            </p>
            <div className="mb-5 flex gap-3">
              <Link
                href="/checker"
                className="inline-flex items-center gap-2.5 rounded bg-navy px-7 py-[15px] text-[15px] font-medium text-white hover:bg-navy-hover"
              >
                無料で期限を確認する
              </Link>
              <Link
                href="/checker/result?program=saikouchiku-11&koufu=2026-06-20&yotei=2027-03-31&kessan=3"
                className="inline-flex items-center gap-2.5 rounded border border-border-input bg-white px-6 py-[15px] text-[15px] font-medium text-ink hover:border-navy"
              >
                計算結果の例を見る
              </Link>
            </div>
            <p className="text-xs text-soft">登録不要・3分で完了。結果はPDFとメールでお渡しします。</p>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-line pt-7">
              {STATS.map((s) => (
                <div key={s.value}>
                  <div className="text-[26px] font-bold tracking-[0.02em]">{s.value}</div>
                  <div className="mt-1.5 text-[13px] leading-[1.8] text-sub">{s.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 埋め込み簡易チェッカー */}
          <div className="overflow-hidden rounded-md border border-border-mid bg-white">
            <div className="flex items-center justify-between border-b border-line bg-surface px-6 py-[18px]">
              <span className="text-[15px] font-bold">報告期限チェッカー</span>
              <span className="rounded-[3px] border border-green-line bg-green-bg px-2 py-[3px] text-[11px] text-green">
                無料・登録不要
              </span>
            </div>
            <form action="/checker" method="get" className="p-6">
              <label htmlFor="lp-program" className="mb-[7px] block text-[13px] text-sub">
                補助金種別・公募回
              </label>
              <select
                id="lp-program"
                name="program"
                className="mb-[18px] h-[42px] w-full rounded border border-border-input bg-white px-3 text-sm"
              >
                {groups.map((g) => (
                  <optgroup key={g.name} label={g.name}>
                    {g.programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {g.name} {p.roundLabel}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="lp-koufu" className="mb-[7px] block text-[13px] text-sub">
                    交付決定日
                  </label>
                  <input
                    id="lp-koufu"
                    type="date"
                    name="koufu"
                    className="tnum h-[42px] w-full rounded border border-border-input px-3 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lp-kessan" className="mb-[7px] block text-[13px] text-sub">
                    決算月
                  </label>
                  <select
                    id="lp-kessan"
                    name="kessan"
                    defaultValue="3"
                    className="h-[42px] w-full rounded border border-border-input bg-white px-3 text-sm"
                  >
                    {KESSAN_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}月
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="flex h-[46px] w-full cursor-pointer items-center justify-center rounded bg-navy text-[15px] font-medium text-white hover:bg-navy-hover"
              >
                期限を計算する
              </button>
              <p className="mt-3.5 text-[11px] leading-[1.8] text-soft">
                公表されている公募要領・事務処理マニュアルに基づく目安です。事務局からの個別通知が優先されます。
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-10 py-16">
          <h2 className="mb-8 text-[13px] font-medium tracking-[0.14em] text-soft">使い方</h2>
          <div className="grid grid-cols-3 gap-px border border-line bg-line">
            {STEPS.map((s) => (
              <div key={s.no} className="bg-white px-7 py-8">
                <div className="mb-3.5 text-xs font-bold tracking-[0.1em] text-blue">{s.no}</div>
                <div className="mb-3 text-lg font-bold">{s.title}</div>
                <p className="text-sm leading-[1.9] text-sub">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能 */}
      <section id="features" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[1200px] px-10 py-16">
          <h2 className="mb-2 text-[13px] font-medium tracking-[0.14em] text-soft">機能</h2>
          <p className="mb-2 text-2xl font-bold">期限を知るだけなら、無料のままでいい。</p>
          <p className="mb-9 text-sm text-sub">
            有料版が引き受けるのは、報告のたびに発生する「書類集め」の実務です。
          </p>
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            {FEATURES.map((f) => (
              <div key={f.tag} className="grid grid-cols-[96px_1fr] gap-5 bg-white px-7 py-[30px]">
                <div className="pt-1 text-[11px] tracking-[0.1em] text-soft">{f.tag}</div>
                <div>
                  <div className="mb-2.5 text-base font-bold">{f.title}</div>
                  <p className="text-sm leading-[1.9] text-sub">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section id="pricing" className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-10 py-16">
          <h2 className="mb-2 text-[13px] font-medium tracking-[0.14em] text-soft">料金</h2>
          <p className="mb-2 text-2xl font-bold">案件ごとの月額。初期費用はありません。</p>
          <p className="mb-9 text-sm text-sub">年払いは2ヶ月分お得です。表示はすべて税抜。</p>
          <div className="grid grid-cols-4 gap-px border border-line bg-line">
            {PLANS.map((p) => (
              <div key={p.name} className="flex flex-col bg-white px-[26px] pb-[34px] pt-[30px]">
                <div className="mb-1 text-[15px] font-bold">{p.name}</div>
                <div className="min-h-[34px] text-xs leading-[1.6] text-soft">{p.for}</div>
                <div className="tnum my-3 mb-5 flex items-baseline gap-1">
                  <span className="text-[32px] font-bold tracking-[0.01em]">{p.price}</span>
                  <span className="text-[13px] text-sub">{p.unit}</span>
                </div>
                <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                  {p.items.map((item) => (
                    <li key={item} className="relative pl-4 text-[13px] leading-[1.7] text-sub">
                      <span className="absolute left-0 top-2 block size-1.5 bg-border-input" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/checker"
                  className="rounded border border-border-input p-3 text-center text-sm font-medium hover:border-navy hover:bg-surface"
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[1200px] px-10 py-16">
          <h2 className="mb-2 text-[13px] font-medium tracking-[0.14em] text-soft">
            よくある質問
          </h2>
          <p className="mb-9 text-2xl font-bold">契約前に、よく聞かれること。</p>
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white px-7 py-[26px]">
                <div className="mb-2.5 flex gap-2.5 text-[15px] font-bold">
                  <span className="text-blue">Q.</span>
                  <span>{f.q}</span>
                </div>
                <p className="pl-[26px] text-sm leading-[1.9] text-sub">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-10 px-10 py-14">
          <div>
            <div className="mb-2.5 text-2xl font-bold text-white">
              まずは1案件、無料で報告期限を出す。
            </div>
            <div className="text-sm text-[#C4D0E2]">
              登録不要、入力は6項目だけ。結果はPDFとメールでお渡しします。
            </div>
          </div>
          <Link
            href="/checker"
            className="whitespace-nowrap rounded bg-white px-[30px] py-[15px] text-[15px] font-bold text-navy hover:bg-[#E8EEF7]"
          >
            無料で期限を確認する
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
