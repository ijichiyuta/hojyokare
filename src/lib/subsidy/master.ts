import type { ProgramMaster } from "./types";

// 期限ルールは 2026-08-16 に Web 調査で検証済み(docs/deadline-rules.md に根拠一覧)。
// 公式の手引き・公募要領PDF原本での最終確認が完了するまで verified: false を維持する。
//
// 検証で確定した要点:
// - 事業化状況報告は「初回+5年間=合計6回」(デザインモックの5回は誤り)
// - 事業再構築は各決算日の3ヶ月後、ものづくりは毎年4/1〜5/31 の固定報告期間
// - 実績報告は「完了日から30日」と「補助事業完了期限日」の早い方
// - 財産処分制限は正式には資産ごとの法定耐用年数を準用(5年は保管義務ベースの目安)

const saikouchikuSources = {
  jisseki: { title: "事業再構築補助金 補助事業の手引き", ref: "実績報告(完了日から30日以内・完了期限日優先)" },
  jigyouka: { title: "事業再構築補助金 補助事業の手引き", ref: "事業化状況報告(決算日の3ヶ月後・計6回)" },
  zaisan: { title: "事業再構築補助金 事務局サイト(財産処分)", ref: "処分制限は法定耐用年数準用・終了年度末から5年保管" },
};

const monozukuriSources = {
  jisseki: { title: "ものづくり補助金 公募要領(18次)", ref: "実施期間・実績報告は2024/12/10まで(延長不可)" },
  jigyouka: { title: "ものづくり補助金総合サイト(事業化状況報告)", ref: "補助事業終了後5年間・計6回、報告期間は毎年4/1〜5/31" },
  zaisan: { title: "ものづくり補助金 公募要領", ref: "処分制限は法定耐用年数準用" },
};

const ZAISAN_NOTE =
  "正式には資産ごとの法定耐用年数を準用。5年は補助事業終了年度末からの保管義務に基づく目安";

export const PROGRAM_MASTERS: ProgramMaster[] = [
  {
    id: "saikouchiku-11",
    subsidyName: "事業再構築補助金",
    roundLabel: "第11回",
    jisseki: {
      daysAfterCompletion: 30,
      completionLimitMonths: 12,
      source: saikouchikuSources.jisseki,
    },
    jigyouka: {
      rule: { type: "fiscalYearEnd", monthsAfter: 3, count: 6 },
      source: saikouchikuSources.jigyouka,
    },
    zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: saikouchikuSources.zaisan },
    verified: false,
  },
  {
    id: "saikouchiku-11-green",
    subsidyName: "事業再構築補助金",
    roundLabel: "第11回(グリーン成長枠)",
    jisseki: {
      daysAfterCompletion: 30,
      completionLimitMonths: 14,
      source: saikouchikuSources.jisseki,
    },
    jigyouka: {
      rule: { type: "fiscalYearEnd", monthsAfter: 3, count: 6 },
      source: saikouchikuSources.jigyouka,
    },
    zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: saikouchikuSources.zaisan },
    verified: false,
  },
  {
    id: "saikouchiku-12",
    subsidyName: "事業再構築補助金",
    roundLabel: "第12回",
    jisseki: {
      daysAfterCompletion: 30,
      completionLimitMonths: 12,
      source: saikouchikuSources.jisseki,
    },
    jigyouka: {
      rule: { type: "fiscalYearEnd", monthsAfter: 3, count: 6 },
      source: saikouchikuSources.jigyouka,
    },
    zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: saikouchikuSources.zaisan },
    verified: false,
  },
  {
    id: "monozukuri-18",
    subsidyName: "ものづくり補助金",
    roundLabel: "第18次",
    jisseki: {
      daysAfterCompletion: 30,
      // 18次特例: 実施期間・実績報告とも 2024/12/10 まで(延長不可)
      completionDeadlineFixed: "2024-12-10",
      source: monozukuriSources.jisseki,
    },
    jigyouka: {
      rule: {
        type: "fixedWindow",
        month: 5,
        day: 31,
        windowLabel: "毎年4月1日〜5月31日",
        count: 6,
      },
      source: monozukuriSources.jigyouka,
    },
    zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: monozukuriSources.zaisan },
    verified: false,
  },
];

export function getProgram(id: string): ProgramMaster {
  const program = PROGRAM_MASTERS.find((p) => p.id === id);
  if (!program) throw new Error(`未対応の制度IDです: ${id}`);
  return program;
}
