import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/marketing/legal";

export const metadata: Metadata = { title: "プライバシーポリシー | ホジョカレ" };

// 【要記入】箇所は正式公開前に事業者情報で置き換えること

export default function PrivacyPage() {
  return (
    <LegalPage title="プライバシーポリシー" updated="2026年8月19日(ドラフト)">
      <LegalSection heading="1. 事業者情報">
        <p>
          【要記入:事業者名】(以下「当社」といいます)は、補助金採択後の期限・報告管理サービス「ホジョカレ」(以下「本サービス」といいます)における個人情報の取扱いについて、以下のとおり定めます。
        </p>
      </LegalSection>

      <LegalSection heading="2. 取得する情報">
        <p>
          (1)報告期限チェッカーに入力された情報(メールアドレス、補助金種別・公募回、交付決定日、補助事業終了予定日、決算月)
          (2)有料プランの登録情報(組織名、担当者名、連絡先、請求情報)
          (3)本サービスにアップロードされた証憑等のファイル
          (4)アクセスログ、Cookie等の利用状況に関する情報
        </p>
      </LegalSection>

      <LegalSection heading="3. 利用目的">
        <p>
          (1)計算結果の送付および期限アラートの配信 (2)本サービスの提供・維持・改善
          (3)本サービスに関する案内(料金プラン等)の送付 (4)問い合わせへの対応
          (5)不正利用の防止。目的外の利用は行いません。
        </p>
      </LegalSection>

      <LegalSection heading="4. 第三者提供">
        <p>
          法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
        </p>
      </LegalSection>

      <LegalSection heading="5. 外部サービスへの委託">
        <p>
          本サービスは、データの保管・メール配信等を以下の外部サービスに委託しています。委託先には適切な安全管理措置を講じます。
        </p>
        <p>
          ・Supabase Inc.(データベース・ストレージ) ・Resend(メール配信) ・Vercel Inc.(ホスティング)
        </p>
      </LegalSection>

      <LegalSection heading="6. 安全管理">
        <p>
          通信はTLSで暗号化し、データはアクセス制御されたプライベートな環境に保管します。証憑等のファイルの共有には有効期限付きの署名付きURLを使用します。
        </p>
      </LegalSection>

      <LegalSection heading="7. 保管期間">
        <p>
          有料プランの証憑等のデータは、補助金の報告義務期間に対応するため契約期間中および契約終了後の法令上必要な期間保管します。無料チェッカーのリード情報は、最後の期限アラート送付後、合理的な期間内に削除します。
        </p>
      </LegalSection>

      <LegalSection heading="8. 開示・訂正・削除の請求">
        <p>
          本人からの個人情報の開示・訂正・利用停止・削除の請求は、contact@hojokare.jp にて受け付け、法令に従い遅滞なく対応します。
        </p>
      </LegalSection>

      <LegalSection heading="9. 改定">
        <p>
          本ポリシーの内容は、法令の改正やサービス内容の変更に応じて改定することがあります。重要な変更は本サービス上で通知します。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
