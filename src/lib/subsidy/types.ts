// 制度マスタと期限計算エンジンの型定義。

export interface SourceRef {
  /** 資料名(例: 事業再構築補助金 公募要領) */
  title: string;
  /** 版・ページ等の参照(例: 第11回公募 / v6.0 p.45) */
  ref: string;
}

/**
 * 事業化状況報告の期限ルール。制度により型が異なる:
 * - 事業再構築型: 各決算日の Nヶ月後(fiscalYearEnd)
 * - ものづくり型: 毎年固定の報告期間(fixedWindow、4/1〜5/31)
 */
export type JigyoukaRule =
  | {
      type: "fiscalYearEnd";
      /** 決算日から期限までの月数 */
      monthsAfter: number;
      /** 報告回数(初回を含む合計) */
      count: number;
    }
  | {
      type: "fixedWindow";
      /** 期限日の月(例: 5) */
      month: number;
      /** 期限日の日(例: 31) */
      day: number;
      /** 報告期間の表示(例: 毎年4月1日〜5月31日) */
      windowLabel: string;
      /** 報告回数(初回を含む合計) */
      count: number;
    };

/**
 * 制度マスタ: 補助金種別×公募回ごとの期限ルール。
 * 期限計算はすべてこのマスタ駆動で行い、ルールの修正はマスタの差し替えだけで済むようにする。
 */
export interface ProgramMaster {
  id: string;
  /** 補助金名(例: 事業再構築補助金) */
  subsidyName: string;
  /** 公募回の表示名(例: 第11回) */
  roundLabel: string;
  jisseki: {
    /** 補助事業完了(予定)日から実績報告期限までの日数。完了期限日を超える場合はそちらが優先 */
    daysAfterCompletion: number;
    /** 交付決定日から補助事業完了期限までの月数(事業再構築: 通常12・グリーン成長枠14) */
    completionLimitMonths?: number;
    /** 公募回固有の固定完了期限 YYYY-MM-DD(ものづくり18次など)。指定時は月数より優先 */
    completionDeadlineFixed?: string;
    source: SourceRef;
  };
  jigyouka: {
    rule: JigyoukaRule;
    source: SourceRef;
  };
  zaisanShobun: {
    /** 財産処分制限期間の目安年数(補助事業終了日起点) */
    years: number;
    /** 正式ルールとの差異など */
    note?: string;
    source: SourceRef;
  };
  /**
   * 公募要領・事務処理マニュアル原本でルールを検証済みか。
   * false のあいだは UI 側で「目安」である旨を強調表示すること。
   * (2026-08-16 Web二次資料+公式サイトで検証済み。原本PDFでの最終確認が残タスク)
   */
  verified: boolean;
}
