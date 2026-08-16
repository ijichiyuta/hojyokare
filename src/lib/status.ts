import { diffDays, parseYMD, type YMD } from "./subsidy/date";

/** 日本時間の今日の日付 */
export function todayJST(): YMD {
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
  return parseYMD(iso);
}

export type Tone = "gray" | "amber" | "danger" | "green";

export interface DueStatus {
  label: string;
  leftLabel: string;
  tone: Tone;
}

const fmt = (n: number) => n.toLocaleString("ja-JP");

/** 期限日と今日からステータス表示(未到来/期限間近/期限超過)を決める */
export function dueStatus(today: YMD, dueISO: string): DueStatus {
  const left = diffDays(today, parseYMD(dueISO));
  if (left < 0) {
    return { label: "期限超過", leftLabel: `${fmt(-left)}日超過`, tone: "danger" };
  }
  if (left === 0) {
    return { label: "本日期限", leftLabel: "本日", tone: "danger" };
  }
  if (left <= 90) {
    return { label: "期限間近", leftLabel: `あと ${fmt(left)} 日`, tone: "amber" };
  }
  return { label: "未到来", leftLabel: `あと ${fmt(left)} 日`, tone: "gray" };
}

/** 財産処分制限期間のステータス */
export function periodStatus(today: YMD, startISO: string, endISO: string): DueStatus {
  const toStart = diffDays(today, parseYMD(startISO));
  const toEnd = diffDays(today, parseYMD(endISO));
  if (toEnd < 0) return { label: "期間終了", leftLabel: "終了", tone: "green" };
  if (toStart > 0) return { label: "開始前", leftLabel: `開始まで ${fmt(toStart)} 日`, tone: "gray" };
  return { label: "制限期間中", leftLabel: `あと ${fmt(toEnd)} 日`, tone: "amber" };
}

/** ステータスチップの配色(デザインのトーン対応) */
export const chipClass: Record<Tone, string> = {
  gray: "border-line bg-[#F7F8F9] text-sub",
  amber: "border-amber-line bg-amber-bg text-amber-deep",
  danger: "border-danger-line bg-danger-bg text-danger",
  green: "border-green-line bg-green-bg text-green",
};
