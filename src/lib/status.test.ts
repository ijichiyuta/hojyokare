import { describe, expect, it } from "vitest";

import { dueStatus, periodStatus } from "./status";

const today = { y: 2026, m: 8, d: 19 };

describe("dueStatus(期限ステータス判定)", () => {
  it("過去の期限は「期限超過」", () => {
    const st = dueStatus(today, "2026-08-18");
    expect(st.label).toBe("期限超過");
    expect(st.leftLabel).toBe("1日超過");
    expect(st.tone).toBe("danger");
  });

  it("当日は「本日期限」", () => {
    expect(dueStatus(today, "2026-08-19").label).toBe("本日期限");
  });

  it("90日以内は「期限間近」、91日以上は「未到来」", () => {
    expect(dueStatus(today, "2026-11-17").label).toBe("期限間近"); // 90日後
    expect(dueStatus(today, "2026-11-18").label).toBe("未到来"); // 91日後
  });

  it("残日数は3桁区切りで表示される", () => {
    const st = dueStatus(today, "2029-08-19"); // 1,096日後
    expect(st.leftLabel).toBe("あと 1,096 日");
  });
});

describe("periodStatus(財産処分制限期間の判定)", () => {
  const start = "2026-01-01";
  const end = "2030-12-31";

  it("期間中は「制限期間中」", () => {
    expect(periodStatus(today, start, end).label).toBe("制限期間中");
  });

  it("開始前は「開始前」", () => {
    expect(periodStatus({ y: 2025, m: 12, d: 1 }, start, end).label).toBe("開始前");
  });

  it("終了後は「期間終了」", () => {
    expect(periodStatus({ y: 2031, m: 1, d: 1 }, start, end).label).toBe("期間終了");
  });
});
