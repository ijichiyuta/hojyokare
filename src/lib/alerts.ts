import { diffDays, parseYMD, type YMD } from "./subsidy/date";
import { calcDeadlines, type DeadlineInput, type DeadlineItem } from "./subsidy/deadline";

export const ALERT_DAYS_BEFORE = 30;

export interface DueAlert {
  deadlineKey: string;
  label: string;
  dueDate: string;
  dueDateJa: string;
  subsidyName: string;
  roundLabel: string;
}

/**
 * 無料アラートの対象を返す純関数: 今日からちょうど30日後が期限の報告項目。
 * 計算は保存済み入力から都度行う(マスタ修正が過去リードにも反映されるように、
 * 結果のスナップショットは保存しない)。
 */
export function findDueAlerts(input: DeadlineInput, today: YMD): DueAlert[] {
  const result = calcDeadlines(input);
  return result.items
    .filter((item: DeadlineItem) => diffDays(today, parseYMD(item.dueDate)) === ALERT_DAYS_BEFORE)
    .map((item) => ({
      deadlineKey: item.key,
      label: item.label,
      dueDate: item.dueDate,
      dueDateJa: item.dueDateJa,
      subsidyName: result.program.subsidyName,
      roundLabel: result.program.roundLabel,
    }));
}
