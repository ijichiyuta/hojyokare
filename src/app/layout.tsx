import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hojokare.jp"),
  title: "ホジョカレ | 補助金採択後の期限・報告管理",
  description:
    "補助金採択後の実績報告・事業化状況報告(5年・計6回)の期限を無料で自動計算。有料版は証憑の回収・チェックリスト・催促まで、報告のたびの書類集めを引き受けます。事業再構築補助金・ものづくり補助金対応。",
  openGraph: {
    title: "ホジョカレ | 補助金採択後の期限・報告管理",
    description:
      "期限の計算は無料。書類集めまで引き受けます。事業再構築補助金・ものづくり補助金対応。",
    siteName: "ホジョカレ",
    locale: "ja_JP",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
