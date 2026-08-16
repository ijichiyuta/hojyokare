# ホジョカレ

補助金採択後の期限・報告管理SaaS。事業再構築補助金・ものづくり補助金の採択企業向けに、
実績報告+事業化状況報告(5年×6回)の期限をカレンダー化し、リマインドと証憑回収で報告漏れを防ぐ。

## ドキュメント

- [要件定義](docs/requirements.md) — デザインプロトタイプから抽出した機能・ドメインルール
- [ロードマップ](docs/roadmap.md) — Phase 1〜4 の開発計画と未決事項
- `design/ホジョカレ.dc.html` — 8画面デザインプロトタイプ(ブラウザで直接開ける)

## 技術スタック

- Next.js(App Router)+ TypeScript + Tailwind CSS
- Supabase(Postgres / Auth / Storage)※Phase 1 後半から
- Vercel(ホスティング)/ Resend(メール)想定

## 開発

```bash
npm run dev        # 開発サーバー
npm test           # 期限計算エンジン等の単体テスト(vitest)
npm run lint       # ESLint
npm run build      # 本番ビルド
```

## 構成

- `src/lib/subsidy/` — ドメインの核。制度マスタ(`master.ts`)と期限計算エンジン(`deadline.ts`)。
  純関数+テストで、UI・DBに依存しない。
  - ⚠️ 期限ルールはデザインモック由来の暫定値(`verified: false`)。公募要領原本での検証が Phase 1 の前提タスク。
