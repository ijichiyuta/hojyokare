const FOOTER_COLS = [
  { head: "サービス", links: ["機能", "料金", "士業パートナー", "報告期限チェッカー"] },
  { head: "サポート", links: ["よくあるご質問", "お問い合わせ", "対応している補助金"] },
  { head: "法的情報", links: ["利用規約", "プライバシーポリシー", "特定商取引法に基づく表記"] },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[280px_repeat(3,1fr)] gap-10 px-10 py-11">
        <div>
          <div className="text-lg font-bold tracking-[0.04em] text-navy">ホジョカレ</div>
          <div className="mt-1.5 text-xs leading-[1.8] text-soft">
            補助金採択後の期限・報告管理
            <br />
            contact@hojokare.jp ／ 平日 9:00–18:00
          </div>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.head}>
            <div className="mb-3.5 text-xs font-bold text-ink">{col.head}</div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <span key={link} className="cursor-default text-[13px] text-sub" title="準備中">
                  {link}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-10 py-4 text-center text-[11px] leading-[1.9] text-mute">
        本サービスは期限管理・書類整理のためのツールです。報告書の作成代行・申請代行は行いません。報告義務の履行責任および最終確認はご利用者にあります。
      </div>
    </footer>
  );
}
