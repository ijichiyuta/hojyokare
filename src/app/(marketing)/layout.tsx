import { MarketingHeader } from "@/components/marketing/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-[1280px] flex-1 bg-paper">
      <MarketingHeader />
      {children}
    </div>
  );
}
