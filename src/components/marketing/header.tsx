import Link from "next/link";

export function MarketingHeader() {
  return (
    <div className="bg-white">
      <header className="print-hide sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-line bg-white px-10">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-[21px] font-bold tracking-[0.04em] text-navy">ホジョカレ</span>
          <span className="text-xs tracking-[0.02em] text-soft">補助金採択後の期限・報告管理</span>
        </Link>
        <nav className="flex items-center gap-7">
          <Link href="/#features" className="text-sm text-sub hover:text-navy">
            機能
          </Link>
          <Link href="/#pricing" className="text-sm text-sub hover:text-navy">
            料金
          </Link>
          <Link href="/#pricing" className="text-sm text-sub hover:text-navy">
            士業パートナー
          </Link>
          <Link href="/#faq" className="text-sm text-sub hover:text-navy">
            よくある質問
          </Link>
          <span className="cursor-default pl-2 text-sm font-medium text-mute" title="準備中">
            ログイン
          </span>
          <Link
            href="/checker"
            className="rounded bg-navy px-[18px] py-2.5 text-sm font-medium text-white hover:bg-navy-hover"
          >
            無料で期限を確認
          </Link>
        </nav>
      </header>
    </div>
  );
}
