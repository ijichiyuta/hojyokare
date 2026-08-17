import { describe, expect, it } from "vitest";

import { findDueAlerts } from "./alerts";

const input = {
  programId: "saikouchiku-11",
  koufuKetteiDate: "2024-06-20",
  shuuryouYoteiDate: "2025-03-31",
  kessanMonth: 3,
};

describe("findDueAlerts(30日前アラート)", () => {
  it("ちょうど30日前の期限だけを返す", () => {
    // 実績報告 2025-04-30 の30日前 = 2025-03-31
    const alerts = findDueAlerts(input, { y: 2025, m: 3, d: 31 });
    expect(alerts).toHaveLength(1);
    expect(alerts[0].deadlineKey).toBe("jisseki");
    expect(alerts[0].dueDateJa).toBe("2025/04/30(水)");
    expect(alerts[0].subsidyName).toBe("事業再構築補助金");
  });

  it("事業化状況報告(2025-06-30)は 2025-05-31 に検知される", () => {
    const alerts = findDueAlerts(input, { y: 2025, m: 5, d: 31 });
    expect(alerts.map((a) => a.deadlineKey)).toEqual(["jigyouka-1"]);
  });

  it("該当しない日は空配列", () => {
    expect(findDueAlerts(input, { y: 2025, m: 4, d: 1 })).toHaveLength(0);
    expect(findDueAlerts(input, { y: 2025, m: 3, d: 30 })).toHaveLength(0);
  });

  it("不正な制度IDは throw する(呼び出し側でスキップする契約)", () => {
    expect(() => findDueAlerts({ ...input, programId: "unknown" }, { y: 2025, m: 3, d: 31 })).toThrow();
  });
});
