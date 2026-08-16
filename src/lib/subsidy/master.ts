import type { ProgramMaster, SourceRef } from "./types";

// 期限ルールは 2026-08-16 に Web 調査で検証済み(docs/deadline-rules.md に根拠一覧)。
// 公式の手引き・公募要領PDF原本での最終確認が完了するまで verified: false を維持する。
//
// 検証で確定した要点:
// - 事業化状況報告は「初回+5年間=合計6回」(デザインモックの5回は誤り)
// - 事業再構築は各決算日の3ヶ月後、ものづくりは毎年4/1〜5/31 の固定報告期間
// - 実績報告は「完了日から30日」と「補助事業完了期限日」の早い方
// - 実施期間: 事業再構築は交付決定から12ヶ月(グリーン成長枠・GX進出類型は14ヶ月)、
//   ものづくりは10ヶ月(グローバル枠12ヶ月、18次は2024/12/10固定・延長不可)
// - 財産処分制限は正式には資産ごとの法定耐用年数を準用(5年は保管義務ベースの目安)
//
// カバレッジ方針: 2026年時点で事業化状況報告の義務が生きている公募回まで収録する。
// 「採択発表日から◯ヶ月」の副次上限は採択発表日を入力に持たないため未実装(docs参照)。

const src = (title: string, ref: string): SourceRef => ({ title, ref });

const SAIKOUCHIKU_JIGYOUKA_SOURCE = src(
  "事業再構築補助金 補助事業の手引き",
  "事業化状況報告(決算日の3ヶ月後・計6回)",
);
const SAIKOUCHIKU_ZAISAN_SOURCE = src(
  "事業再構築補助金 事務局サイト(財産処分)",
  "処分制限は法定耐用年数準用・終了年度末から5年保管",
);
const MONOZUKURI_JIGYOUKA_SOURCE = src(
  "ものづくり補助金総合サイト(事業化状況報告)",
  "補助事業終了後5年間・計6回、報告期間は毎年4/1〜5/31",
);
const MONOZUKURI_ZAISAN_SOURCE = src("ものづくり補助金 公募要領", "処分制限は法定耐用年数準用");

const ZAISAN_NOTE =
  "正式には資産ごとの法定耐用年数を準用。5年は補助事業終了年度末からの保管義務に基づく目安";

/** 事業再構築補助金の収録公募回(新しい順)。months = 交付決定日から補助事業完了期限までの月数 */
const SAIKOUCHIKU_ROUNDS: { id: string; roundLabel: string; months: number; ref: string }[] = [
  { id: "saikouchiku-13", roundLabel: "第13回(GX進出類型以外)", months: 12, ref: "第13回公募要領(実施期間12ヶ月)" },
  { id: "saikouchiku-13-gx", roundLabel: "第13回(GX進出類型)", months: 14, ref: "第13回公募要領(GX進出類型14ヶ月)" },
  { id: "saikouchiku-12", roundLabel: "第12回(GX進出類型以外)", months: 12, ref: "第12回公募要領(実施期間12ヶ月)" },
  { id: "saikouchiku-12-gx", roundLabel: "第12回(GX進出類型)", months: 14, ref: "第12回公募要領(GX進出類型14ヶ月)" },
  { id: "saikouchiku-11", roundLabel: "第11回(グリーン成長枠以外)", months: 12, ref: "第11回公募要領(実施期間12ヶ月)" },
  { id: "saikouchiku-11-green", roundLabel: "第11回(グリーン成長枠)", months: 14, ref: "第11回公募要領(グリーン成長枠14ヶ月)" },
  { id: "saikouchiku-10", roundLabel: "第10回(グリーン成長枠以外)", months: 12, ref: "第10回公募要領(実施期間12ヶ月)" },
  { id: "saikouchiku-10-green", roundLabel: "第10回(グリーン成長枠)", months: 14, ref: "第10回公募要領(グリーン成長枠14ヶ月)" },
  { id: "saikouchiku-9", roundLabel: "第9回(グリーン成長枠以外)", months: 12, ref: "第6〜9回 補助事業の手引き(実施期間12ヶ月)" },
  { id: "saikouchiku-9-green", roundLabel: "第9回(グリーン成長枠)", months: 14, ref: "第6〜9回 補助事業の手引き(グリーン成長枠14ヶ月)" },
  { id: "saikouchiku-8", roundLabel: "第8回(グリーン成長枠以外)", months: 12, ref: "第6〜9回 補助事業の手引き(実施期間12ヶ月)" },
  { id: "saikouchiku-8-green", roundLabel: "第8回(グリーン成長枠)", months: 14, ref: "第6〜9回 補助事業の手引き(グリーン成長枠14ヶ月)" },
  { id: "saikouchiku-7", roundLabel: "第7回(グリーン成長枠以外)", months: 12, ref: "第6〜9回 補助事業の手引き(実施期間12ヶ月)" },
  { id: "saikouchiku-7-green", roundLabel: "第7回(グリーン成長枠)", months: 14, ref: "第6〜9回 補助事業の手引き(グリーン成長枠14ヶ月)" },
  { id: "saikouchiku-6", roundLabel: "第6回(グリーン成長枠以外)", months: 12, ref: "第6〜9回 補助事業の手引き(実施期間12ヶ月)" },
  { id: "saikouchiku-6-green", roundLabel: "第6回(グリーン成長枠)", months: 14, ref: "第6〜9回 補助事業の手引き(グリーン成長枠14ヶ月)" },
];

/** ものづくり補助金の収録公募回(新しい順)。fixed = 公募回固有の固定完了期限 */
const MONOZUKURI_ROUNDS: {
  id: string;
  roundLabel: string;
  months?: number;
  fixed?: string;
  ref: string;
}[] = [
  { id: "monozukuri-22", roundLabel: "第22次(高付加価値化枠)", months: 10, ref: "第22次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-22-global", roundLabel: "第22次(グローバル枠)", months: 12, ref: "第22次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-21", roundLabel: "第21次(高付加価値化枠)", months: 10, ref: "第21次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-21-global", roundLabel: "第21次(グローバル枠)", months: 12, ref: "第21次公募要領(グローバル枠12ヶ月)" },
  { id: "monozukuri-20", roundLabel: "第20次(高付加価値化枠)", months: 10, ref: "第20次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-20-global", roundLabel: "第20次(グローバル枠)", months: 12, ref: "第20次公募要領(グローバル枠12ヶ月)" },
  { id: "monozukuri-19", roundLabel: "第19次(高付加価値化枠)", months: 10, ref: "第19次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-19-global", roundLabel: "第19次(グローバル枠)", months: 12, ref: "第19次公募要領(グローバル枠12ヶ月)" },
  { id: "monozukuri-18", roundLabel: "第18次", fixed: "2024-12-10", ref: "第18次公募要領(2024/12/10まで・延長不可)" },
  { id: "monozukuri-17", roundLabel: "第17次(省力化オーダーメイド枠)", months: 12, ref: "第17次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-16", roundLabel: "第16次", months: 10, ref: "第16次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-15", roundLabel: "第15次", months: 10, ref: "第15次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-14", roundLabel: "第14次", months: 10, ref: "第14次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-13", roundLabel: "第13次", months: 10, ref: "第13次公募要領(実施期間10ヶ月)" },
];

export const PROGRAM_MASTERS: ProgramMaster[] = [
  ...SAIKOUCHIKU_ROUNDS.map(
    (r): ProgramMaster => ({
      id: r.id,
      subsidyName: "事業再構築補助金",
      roundLabel: r.roundLabel,
      jisseki: {
        daysAfterCompletion: 30,
        completionLimitMonths: r.months,
        source: src("事業再構築補助金 公募要領", r.ref),
      },
      jigyouka: {
        rule: { type: "fiscalYearEnd", monthsAfter: 3, count: 6 },
        source: SAIKOUCHIKU_JIGYOUKA_SOURCE,
      },
      zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: SAIKOUCHIKU_ZAISAN_SOURCE },
      verified: false,
    }),
  ),
  ...MONOZUKURI_ROUNDS.map(
    (r): ProgramMaster => ({
      id: r.id,
      subsidyName: "ものづくり補助金",
      roundLabel: r.roundLabel,
      jisseki: {
        daysAfterCompletion: 30,
        ...(r.fixed
          ? { completionDeadlineFixed: r.fixed }
          : { completionLimitMonths: r.months }),
        source: src("ものづくり補助金 公募要領", r.ref),
      },
      jigyouka: {
        rule: {
          type: "fixedWindow",
          month: 5,
          day: 31,
          windowLabel: "毎年4月1日〜5月31日",
          count: 6,
        },
        source: MONOZUKURI_JIGYOUKA_SOURCE,
      },
      zaisanShobun: { years: 5, note: ZAISAN_NOTE, source: MONOZUKURI_ZAISAN_SOURCE },
      verified: false,
    }),
  ),
];

export function getProgram(id: string): ProgramMaster {
  const program = PROGRAM_MASTERS.find((p) => p.id === id);
  if (!program) throw new Error(`未対応の制度IDです: ${id}`);
  return program;
}
