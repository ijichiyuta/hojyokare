import {
  addDays,
  addMonths,
  addYears,
  compare,
  endOfMonth,
  firstFiscalYearEndOnOrAfter,
  formatJa,
  parseYMD,
  toISO,
  type YMD,
} from "./date";
import { getProgram } from "./master";
import type { ProgramMaster, SourceRef } from "./types";

export interface DeadlineInput {
  programId: string;
  /** 交付決定日 YYYY-MM-DD */
  koufuKetteiDate: string;
  /** 補助事業終了予定日 YYYY-MM-DD */
  shuuryouYoteiDate: string;
  /** 決算月 1-12 */
  kessanMonth: number;
}

export type DeadlineKind = "completion" | "jisseki" | "jigyouka" | "zaisan-shobun";

export interface DeadlineItem {
  /** 例: "jisseki", "jigyouka-1" */
  key: string;
  kind: DeadlineKind;
  /** 例: 実績報告、事業化状況報告(1回目) */
  label: string;
  /** ISO形式 YYYY-MM-DD */
  dueDate: string;
  /** 表示用 "2025/04/30(水)" */
  dueDateJa: string;
  source: SourceRef;
  note?: string;
}

export interface DeadlineResult {
  program: { id: string; subsidyName: string; roundLabel: string; verified: boolean };
  input: DeadlineInput;
  /** 補助事業完了期限(交付決定日+12/14ヶ月、または公募回固有の固定日) */
  completionDeadline: DeadlineItem;
  jisseki: DeadlineItem;
  jigyouka: DeadlineItem[];
  zaisanShobun: {
    label: string;
    startDate: string;
    endDate: string;
    periodJa: string;
    source: SourceRef;
    note?: string;
  };
  /** 報告系期限の昇順一覧(実績報告+事業化状況報告) */
  items: DeadlineItem[];
}

function calcCompletionDeadline(program: ProgramMaster, koufu: YMD): DeadlineItem {
  const { completionDeadlineFixed, completionLimitMonths } = program.jisseki;
  let due: YMD;
  let note: string;
  if (completionDeadlineFixed) {
    due = parseYMD(completionDeadlineFixed);
    note = `${program.roundLabel}の固定期限(延長不可)`;
  } else if (completionLimitMonths !== undefined) {
    due = addMonths(koufu, completionLimitMonths);
    note = `交付決定日から${completionLimitMonths}ヶ月以内`;
  } else {
    throw new Error(`制度マスタに完了期限の定義がありません: ${program.id}`);
  }
  return {
    key: "completion",
    kind: "completion",
    label: "補助事業完了期限",
    dueDate: toISO(due),
    dueDateJa: formatJa(due),
    source: program.jisseki.source,
    note,
  };
}

function calcJigyoukaDeadlines(
  program: ProgramMaster,
  yotei: YMD,
  kessanMonth: number,
): DeadlineItem[] {
  const { rule } = program.jigyouka;
  const items: DeadlineItem[] = [];

  if (rule.type === "fiscalYearEnd") {
    // 補助事業終了(予定)日の属する会計年度の決算日を初回とし、以降毎年。
    const firstFye = firstFiscalYearEndOnOrAfter(yotei, kessanMonth);
    for (let i = 0; i < rule.count; i++) {
      const fye = endOfMonth(firstFye.y + i, kessanMonth);
      const due = addMonths(fye, rule.monthsAfter);
      items.push({
        key: `jigyouka-${i + 1}`,
        kind: "jigyouka",
        label: `事業化状況報告(${i + 1}回目)`,
        dueDate: toISO(due),
        dueDateJa: formatJa(due),
        source: program.jigyouka.source,
        note: `${toISO(fye).replaceAll("-", "/")} 決算の${rule.monthsAfter}ヶ月後まで`,
      });
    }
    return items;
  }

  // fixedWindow: 補助事業終了(予定)日以後に最初に到来する期限日(例: 5/31)を初回とし、以降毎年。
  // 正式ルール(19次手引き)は「補助金受領後、最初に迎える4/1から60日以内」が初回。受領日は
  // 入力にないため終了予定日で近似しており、額確定が3/1以降にずれると実際は1年繰り下がる。
  const firstYear =
    compare({ y: yotei.y, m: rule.month, d: rule.day }, yotei) >= 0 ? yotei.y : yotei.y + 1;
  for (let i = 0; i < rule.count; i++) {
    const due: YMD = { y: firstYear + i, m: rule.month, d: rule.day };
    items.push({
      key: `jigyouka-${i + 1}`,
      kind: "jigyouka",
      label: `事業化状況報告(${i + 1}回目)`,
      dueDate: toISO(due),
      dueDateJa: formatJa(due),
      source: program.jigyouka.source,
      note: `報告期間 ${rule.windowLabel}(初回は補助金受領後最初の4/1から。額確定が3月以降の場合は1年繰り下げ)`,
    });
  }
  return items;
}

/**
 * 制度マスタに基づき、交付決定日・補助事業終了予定日・決算月から
 * 報告期限一式と財産処分制限期間を算出する。
 */
export function calcDeadlines(input: DeadlineInput): DeadlineResult {
  const program = getProgram(input.programId);
  if (!Number.isInteger(input.kessanMonth) || input.kessanMonth < 1 || input.kessanMonth > 12) {
    throw new Error(`決算月は1〜12で指定してください: ${input.kessanMonth}`);
  }
  const koufu = parseYMD(input.koufuKetteiDate);
  const yotei = parseYMD(input.shuuryouYoteiDate);
  if (compare(yotei, koufu) < 0) {
    throw new Error("補助事業終了予定日は交付決定日以降の日付を指定してください");
  }

  const completionDeadline = calcCompletionDeadline(program, koufu);

  // 実績報告: 「完了日から30日を経過した日」と「補助事業完了期限日」のいずれか早い日。
  // 完了日は入力にないため終了予定日を起算とする(実際の完了が早ければその分前倒し)。
  const byCompletion = addDays(yotei, program.jisseki.daysAfterCompletion);
  const limit = parseYMD(completionDeadline.dueDate);
  const capped = compare(byCompletion, limit) > 0;
  const jissekiDue = capped ? limit : byCompletion;
  const jisseki: DeadlineItem = {
    key: "jisseki",
    kind: "jisseki",
    label: "実績報告",
    dueDate: toISO(jissekiDue),
    dueDateJa: formatJa(jissekiDue),
    source: program.jisseki.source,
    note: capped
      ? `補助事業完了期限日(${completionDeadline.dueDateJa})が優先されるため同日が期限`
      : `事業完了日または補助事業終了予定日の早い日から${program.jisseki.daysAfterCompletion}日以内`,
  };

  const jigyouka = calcJigyoukaDeadlines(program, yotei, input.kessanMonth);

  // 財産処分制限期間: 補助事業終了(予定)日から N年間(目安)。
  const zaisanEnd = addDays(addYears(yotei, program.zaisanShobun.years), -1);
  const zaisanShobun: DeadlineResult["zaisanShobun"] = {
    label: "財産処分制限期間",
    startDate: toISO(yotei),
    endDate: toISO(zaisanEnd),
    periodJa: `${toISO(yotei).replaceAll("-", "/")} 〜 ${toISO(zaisanEnd).replaceAll("-", "/")}`,
    source: program.zaisanShobun.source,
    note: program.zaisanShobun.note,
  };

  const items = [jisseki, ...jigyouka].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return {
    program: {
      id: program.id,
      subsidyName: program.subsidyName,
      roundLabel: program.roundLabel,
      verified: program.verified,
    },
    input,
    completionDeadline,
    jisseki,
    jigyouka,
    zaisanShobun,
    items,
  };
}
