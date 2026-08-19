import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal";

export const metadata: Metadata = { title: "特定商取引法に基づく表記 | ホジョカレ" };

// 【要記入】箇所は正式公開前に事業者情報で置き換えること

const ROWS: { label: string; value: string }[] = [
  { label: "販売事業者", value: "【要記入:事業者名】" },
  { label: "運営責任者", value: "【要記入:代表者名】" },
  { label: "所在地", value: "【要記入:住所】" },
  {
    label: "電話番号",
    value: "【要記入】※請求があった場合は遅滞なく開示します。お問い合わせはメールでお願いします",
  },
  { label: "メールアドレス", value: "contact@hojokare.jp" },
  {
    label: "販売価格",
    value:
      "料金ページに表示(税抜)。スタンダード 9,800円/月・案件、同一企業2案件目以降 4,900円/月・案件、士業パートナー 29,800円/月(20案件込み・超過1,200円/件月)。年払いは10ヶ月分",
  },
  { label: "商品代金以外の必要料金", value: "消費税。インターネット接続にかかる通信費用は利用者負担" },
  { label: "支払方法", value: "クレジットカード決済(予定)" },
  { label: "支払時期", value: "申込時および各更新日に課金" },
  { label: "サービス提供時期", value: "決済完了後、直ちに利用できます" },
  {
    label: "解約・返金",
    value:
      "本サービス上の手続によりいつでも解約できます。解約は次回更新日をもって効力を生じ、支払済み料金の日割返金は行いません",
  },
  {
    label: "動作環境",
    value: "最新版の Google Chrome / Microsoft Edge / Safari を推奨(デスクトップ)",
  },
];

export default function TokushohoPage() {
  return (
    <LegalPage title="特定商取引法に基づく表記" updated="2026年8月19日(ドラフト)">
      <div className="overflow-hidden rounded-md border border-line bg-white">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[220px_1fr] gap-4 border-b border-line-soft px-6 py-4 last:border-b-0"
          >
            <div className="text-sm font-medium">{row.label}</div>
            <div className="text-sm leading-relaxed text-sub">{row.value}</div>
          </div>
        ))}
      </div>
    </LegalPage>
  );
}
