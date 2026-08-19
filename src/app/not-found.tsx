import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-10 py-24">
      <div className="w-full max-w-[480px] rounded-md border border-line bg-white p-10 text-center">
        <div className="mb-2 text-[15px] font-bold tracking-[0.04em] text-navy">ホジョカレ</div>
        <h1 className="mb-3 text-2xl font-bold">ページが見つかりません</h1>
        <p className="mb-8 text-sm leading-[1.9] text-sub">
          URLが変更されたか、削除された可能性があります。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="rounded bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-hover"
          >
            トップへ戻る
          </Link>
          <Link
            href="/checker"
            className="rounded border border-border-input px-6 py-3 text-sm hover:border-navy"
          >
            報告期限チェッカー
          </Link>
        </div>
      </div>
    </div>
  );
}
