import { MarketingFooter } from "./footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto max-w-[840px] px-10 pb-20 pt-12">
        <h1 className="mb-2 text-[28px] font-bold">{title}</h1>
        <p className="mb-10 text-xs text-soft">最終更新日: {updated}</p>
        <div className="flex flex-col gap-8">{children}</div>
      </div>
      <MarketingFooter />
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 border-b border-line pb-2 text-base font-bold">{heading}</h2>
      <div className="flex flex-col gap-3 text-sm leading-loose text-sub">{children}</div>
    </section>
  );
}
