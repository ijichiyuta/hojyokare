import type { ProgramMaster, SourceRef } from "./types";

// 期限ルールは 2026-08-16 に公式PDF原本で確認済み(docs/deadline-rules.md に引用と根拠一覧)。
//
// 原本で確定した要点:
// - 実績報告: 「完了日から起算して30日を経過した日又は補助事業完了期限日のいずれか早い日」
//   (事業再構築: 手引き(18)実績報告書・交付規程第17条 / ものづくり: 19次手引き)
// - 事業再構築の事業化状況報告: 「初回は補助事業終了年度の決算日の3か月後、以降毎年」計6回
//   (事業化状況報告システム操作マニュアル 3.4版)
// - ものづくりの事業化状況報告: 「補助金受領後、最初に迎える4月1日から60日以内を初回として
//   以降5年間(合計6回)」= 期限は毎年5/31。額確定が3/1以降なら初回は1年繰り下げ(19次手引き)
// - 実施期間: 事業再構築 12ヶ月(グリーン成長枠・GX進出類型14ヶ月 / 第13回公募要領で確認)、
//   ものづくり 10ヶ月(グローバル枠12ヶ月 / 19次公募要領で確認)、18次は2024/12/10固定
// - 財産処分制限: 減価償却資産の耐用年数等に関する省令(昭和40年大蔵省令第15号)の耐用年数を準用
//
// verified: true = 当該公募回の実施期間まで原本確認済み。false = 報告ルールは原本確認済みだが
// 実施期間の月数は他回からのパターン適用(該当回の公募要領での確認が残り)。
//
// カバレッジ方針: 2026年時点で事業化状況報告の義務が生きている公募回まで収録する。
// 「採択発表日から◯ヶ月」の副次上限は採択発表日を入力に持たないため未実装(docs参照)。

const src = (title: string, ref: string): SourceRef => ({ title, ref });

const SAIKOUCHIKU_JIGYOUKA_SOURCE = src(
  "事業化状況報告システム操作マニュアル 3.4版",
  "初回=補助事業終了年度の決算日の3ヶ月後、以降毎年・計6回",
);
const SAIKOUCHIKU_ZAISAN_SOURCE = src(
  "事業再構築補助金 補助事業の手引き",
  "処分制限期間は省令(昭和40年大蔵省令第15号)の耐用年数を準用",
);
const MONOZUKURI_JIGYOUKA_SOURCE = src(
  "ものづくり補助金 補助事業の手引き(19次 1.0版)",
  "補助金受領後最初の4/1から60日以内を初回に5年間・計6回",
);
const MONOZUKURI_ZAISAN_SOURCE = src(
  "ものづくり補助金 補助事業の手引き(19次 1.0版)",
  "単価50万円以上の処分制限財産は耐用年数準用の処分制限期間内は要管理",
);

const ZAISAN_NOTE =
  "正式には資産ごとの法定耐用年数を準用。5年は補助事業終了年度末からの保管義務に基づく目安";

/** 事業再構築補助金の収録公募回(新しい順)。months = 交付決定日から補助事業完了期限までの月数 */
const SAIKOUCHIKU_ROUNDS: {
  id: string;
  roundLabel: string;
  months: number;
  ref: string;
  verified?: boolean;
}[] = [
  { id: "saikouchiku-13", roundLabel: "第13回(GX進出類型以外)", months: 12, ref: "第13回公募要領 1.0版(交付決定日から12か月・採択発表日から14か月後まで)", verified: true },
  { id: "saikouchiku-13-gx", roundLabel: "第13回(GX進出類型)", months: 14, ref: "第13回公募要領 1.0版(交付決定日から14か月・採択発表日から16か月後まで)", verified: true },
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
  verified?: boolean;
}[] = [
  { id: "monozukuri-23", roundLabel: "第23次(高付加価値化枠)", months: 10, ref: "第23次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-23-global", roundLabel: "第23次(グローバル枠)", months: 12, ref: "第23次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-22", roundLabel: "第22次(高付加価値化枠)", months: 10, ref: "第22次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-22-global", roundLabel: "第22次(グローバル枠)", months: 12, ref: "第22次公募要領(実施期間・要原本確認)" },
  { id: "monozukuri-21", roundLabel: "第21次(高付加価値化枠)", months: 10, ref: "第21次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-21-global", roundLabel: "第21次(グローバル枠)", months: 12, ref: "第21次公募要領(グローバル枠12ヶ月)" },
  { id: "monozukuri-20", roundLabel: "第20次(高付加価値化枠)", months: 10, ref: "第20次公募要領(実施期間10ヶ月)" },
  { id: "monozukuri-20-global", roundLabel: "第20次(グローバル枠)", months: 12, ref: "第20次公募要領(グローバル枠12ヶ月)" },
  { id: "monozukuri-19", roundLabel: "第19次(高付加価値化枠)", months: 10, ref: "第19次公募要領(交付決定日から10か月・採択発表日から12か月後まで)", verified: true },
  { id: "monozukuri-19-global", roundLabel: "第19次(グローバル枠)", months: 12, ref: "第19次公募要領(交付決定日から12か月・採択発表日から14か月後まで)", verified: true },
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
      verified: r.verified ?? false,
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
      verified: r.verified ?? false,
    }),
  ),
];

export function getProgram(id: string): ProgramMaster {
  const program = PROGRAM_MASTERS.find((p) => p.id === id);
  if (!program) throw new Error(`未対応の制度IDです: ${id}`);
  return program;
}
