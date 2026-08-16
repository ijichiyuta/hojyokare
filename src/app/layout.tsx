import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ホジョカレ | 補助金採択後の期限・報告管理",
  description:
    "実績報告は交付決定から12ヶ月以内。そのあと事業化状況報告が続く。交付決定日を入れるだけで、報告期限がカレンダーになります。事業再構築補助金・ものづくり補助金対応。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
