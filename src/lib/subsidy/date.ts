// タイムゾーン非依存の日付ユーティリティ。
// 期限計算は「日」単位のドメインなので、Date は UTC 経由の暦計算にのみ使い、
// 値はすべて YMD(年・月・日)で持ち回る。

export interface YMD {
  y: number;
  /** 1-12 */
  m: number;
  d: number;
}

const DAY_MS = 86_400_000;

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function isValid({ y, m, d }: YMD): boolean {
  return Number.isInteger(y) && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

/** "YYYY-MM-DD" または "YYYY/MM/DD" を受け付ける */
export function parseYMD(s: string): YMD {
  const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(s.trim());
  if (!match) throw new Error(`日付の形式が不正です: ${s}`);
  const ymd = { y: +match[1], m: +match[2], d: +match[3] };
  if (!isValid(ymd)) throw new Error(`存在しない日付です: ${s}`);
  return ymd;
}

export function toISO({ y, m, d }: YMD): string {
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

export function addDays(date: YMD, days: number): YMD {
  const t = new Date(Date.UTC(date.y, date.m - 1, date.d) + days * DAY_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

/** 月加算。加算後に存在しない日は月末に丸める(例: 1/31 の1ヶ月後 → 2/28) */
export function addMonths(date: YMD, months: number): YMD {
  const total = date.y * 12 + (date.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { y, m, d: Math.min(date.d, daysInMonth(y, m)) };
}

export function addYears(date: YMD, years: number): YMD {
  return addMonths(date, years * 12);
}

export function endOfMonth(y: number, m: number): YMD {
  return { y, m, d: daysInMonth(y, m) };
}

/** a < b なら負、同日なら 0、a > b なら正 */
export function compare(a: YMD, b: YMD): number {
  return Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d);
}

export function diffDays(from: YMD, to: YMD): number {
  return Math.round(
    (Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / DAY_MS,
  );
}

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

/** "2025/04/30(水)" 形式(デザインの表記に合わせる) */
export function formatJa(date: YMD): string {
  const w = WEEKDAYS_JA[new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay()];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.y}/${pad(date.m)}/${pad(date.d)}(${w})`;
}

/** 基準日以後(同日を含む)で最初に到来する決算日(=決算月の末日) */
export function firstFiscalYearEndOnOrAfter(date: YMD, fiscalMonth: number): YMD {
  const sameYear = endOfMonth(date.y, fiscalMonth);
  return compare(sameYear, date) >= 0 ? sameYear : endOfMonth(date.y + 1, fiscalMonth);
}
