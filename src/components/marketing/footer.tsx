import Link from "next/link";

const FOOTER_COLS: {
  head: string;
  links: { label: string; href?: string }[];
}[] = [
  {
    head: "サービス",
    links: [
      { label: "機能", href: "/#features" },
      { label: "料金", href: "/#pricing" },
      { label: "士業パートナー", href: "/#pricing" },
      { label: "報告期限チェッカー", href: "/checker" },
    ],
  },
  {
    head: "サポート",
    links: [
      { label: "よくあるご質問", href: "/#faq" },
      { label: "お問い合わせ" },
      { label: "対応している補助金", href: "/#faq" },
    ],
  },
  {
    head: "法的情報",
    links: [
      { label: "利用規約", href: "/legal/terms" },
      { label: "プライバシーポリシー", href: "/legal/privacy" },
      { label: "特定商取引法に基づく表記", href: "/legal/tokushoho" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="print-hide border-t border-line bg-white">
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
              {col.links.map((link) =>
                link.href ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13px] text-sub hover:text-navy"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={link.label}
                    className="cursor-default text-[13px] text-sub"
                    title="準備中"
                  >
                    {link.label}
                  </span>
                ),
              )}
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
