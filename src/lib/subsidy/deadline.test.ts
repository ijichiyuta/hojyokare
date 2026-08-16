import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  diffDays,
  firstFiscalYearEndOnOrAfter,
  formatJa,
  parseYMD,
  toISO,
} from "./date";
import { calcDeadlines } from "./deadline";

describe("date utils", () => {
  it("parseYMD はスラッシュ・ハイフン両対応で不正日付を拒否する", () => {
    expect(parseYMD("2024/06/20")).toEqual({ y: 2024, m: 6, d: 20 });
    expect(parseYMD("2024-06-20")).toEqual({ y: 2024, m: 6, d: 20 });
    expect(() => parseYMD("2024/02/30")).toThrow("存在しない日付");
    expect(() => parseYMD("2024年6月20日")).toThrow("形式が不正");
  });

  it("addDays は月末・年末をまたげる", () => {
    expect(toISO(addDays({ y: 2025, m: 3, d: 31 }, 30))).toBe("2025-04-30");
    expect(toISO(addDays({ y: 2024, m: 12, d: 31 }, 1))).toBe("2025-01-01");
    expect(toISO(addDays({ y: 2024, m: 2, d: 28 }, 1))).toBe("2024-02-29"); // うるう年
  });

  it("addMonths は存在しない日を月末に丸める", () => {
    expect(toISO(addMonths({ y: 2024, m: 1, d: 31 }, 1))).toBe("2024-02-29");
    expect(toISO(addMonths({ y: 2023, m: 1, d: 31 }, 1))).toBe("2023-02-28");
    expect(toISO(addMonths({ y: 2024, m: 6, d: 20 }, 12))).toBe("2025-06-20");
  });

  it("firstFiscalYearEndOnOrAfter は同日(決算日当日)を含む", () => {
    // 3月決算: 3/31当日は当年、4/1なら翌年
    expect(toISO(firstFiscalYearEndOnOrAfter({ y: 2025, m: 3, d: 31 }, 3))).toBe("2025-03-31");
    expect(toISO(firstFiscalYearEndOnOrAfter({ y: 2025, m: 4, d: 1 }, 3))).toBe("2026-03-31");
    expect(toISO(firstFiscalYearEndOnOrAfter({ y: 2025, m: 1, d: 15 }, 12))).toBe("2025-12-31");
  });

  it("formatJa はデザイン表記(曜日つき)に一致する", () => {
    expect(formatJa({ y: 2025, m: 4, d: 30 })).toBe("2025/04/30(水)");
  });

  it("diffDays は残日数計算に使える", () => {
    expect(diffDays({ y: 2025, m: 6, d: 23 }, { y: 2025, m: 6, d: 30 })).toBe(7);
  });
});

describe("calcDeadlines: 事業再構築(決算日基準)", () => {
  // 計算結果画面の入力例: 事業再構築 第11回 / 交付決定 2024/06/20 / 終了予定 2025/03/31 / 3月決算
  const input = {
    programId: "saikouchiku-11",
    koufuKetteiDate: "2024-06-20",
    shuuryouYoteiDate: "2025-03-31",
    kessanMonth: 3,
  };

  it("実績報告は終了予定日の30日後(モックの 2025/04/30 と一致)", () => {
    const r = calcDeadlines(input);
    expect(r.jisseki.dueDate).toBe("2025-04-30");
    expect(r.jisseki.dueDateJa).toBe("2025/04/30(水)");
  });

  it("実績報告は補助事業完了期限日でキャップされる(早い方優先)", () => {
    // 終了予定 2025/06/10 → +30日 = 2025/07/10 だが完了期限 2025/06/20 が先に来る
    const r = calcDeadlines({ ...input, shuuryouYoteiDate: "2025-06-10" });
    expect(r.completionDeadline.dueDate).toBe("2025-06-20");
    expect(r.jisseki.dueDate).toBe("2025-06-20");
    expect(r.jisseki.note).toContain("完了期限日");
  });

  it("補助事業完了期限は交付決定日+12ヶ月(グリーン成長枠は14ヶ月)", () => {
    expect(calcDeadlines(input).completionDeadline.dueDate).toBe("2025-06-20");
    expect(
      calcDeadlines({ ...input, programId: "saikouchiku-11-green" }).completionDeadline.dueDate,
    ).toBe("2025-08-20");
  });

  it("事業化状況報告は決算日+3ヶ月×合計6回(初回+5年間)", () => {
    // Web検証(2026-08-16)で「合計6回」を確認。モックの5回表示は誤り。
    const r = calcDeadlines(input);
    expect(r.jigyouka.map((j) => j.dueDate)).toEqual([
      "2025-06-30",
      "2026-06-30",
      "2027-06-30",
      "2028-06-30",
      "2029-06-30",
      "2030-06-30",
    ]);
    expect(r.jigyouka[0].label).toBe("事業化状況報告(1回目)");
    expect(r.jigyouka[5].label).toBe("事業化状況報告(6回目)");
  });

  it("財産処分制限期間は終了予定日から5年間(モックの 2025/03/31〜2030/03/30 と一致)+注記あり", () => {
    const r = calcDeadlines(input);
    expect(r.zaisanShobun.startDate).toBe("2025-03-31");
    expect(r.zaisanShobun.endDate).toBe("2030-03-30");
    expect(r.zaisanShobun.periodJa).toBe("2025/03/31 〜 2030/03/30");
    expect(r.zaisanShobun.note).toContain("法定耐用年数");
  });

  it("items は期限日の昇順で並ぶ(実績報告+事業化6回=7件)", () => {
    const r = calcDeadlines(input);
    expect(r.items).toHaveLength(7);
    const dates = r.items.map((i) => i.dueDate);
    expect(dates).toEqual([...dates].sort());
    expect(r.items[0].key).toBe("jisseki");
  });

  it("決算月が終了月より後でも初回は同一年度になる", () => {
    // 終了予定 2025/03/31・12月決算 → 最初の決算日 2025/12/31 → 期限 2026/03/31
    const r = calcDeadlines({ ...input, kessanMonth: 12 });
    expect(r.jigyouka[0].dueDate).toBe("2026-03-31");
  });
});

describe("calcDeadlines: ものづくり(固定報告期間)", () => {
  const input = {
    programId: "monozukuri-18",
    koufuKetteiDate: "2024-03-01",
    shuuryouYoteiDate: "2024-11-30",
    kessanMonth: 3,
  };

  it("完了期限は18次特例の固定日 2024/12/10", () => {
    const r = calcDeadlines(input);
    expect(r.completionDeadline.dueDate).toBe("2024-12-10");
    expect(r.completionDeadline.note).toContain("固定期限");
  });

  it("実績報告は固定完了期限でキャップされる(2024/12/30 → 2024/12/10)", () => {
    expect(calcDeadlines(input).jisseki.dueDate).toBe("2024-12-10");
  });

  it("事業化状況報告は毎年5/31×6回(決算月に依存しない)", () => {
    const r = calcDeadlines(input);
    expect(r.jigyouka.map((j) => j.dueDate)).toEqual([
      "2025-05-31",
      "2026-05-31",
      "2027-05-31",
      "2028-05-31",
      "2029-05-31",
      "2030-05-31",
    ]);
    // 決算月を変えても結果は同じ
    expect(calcDeadlines({ ...input, kessanMonth: 9 }).jigyouka[0].dueDate).toBe("2025-05-31");
    expect(r.jigyouka[0].note).toContain("4月1日〜5月31日");
  });

  it("終了(予定)日が期限日当日なら同年が初回になる", () => {
    const r = calcDeadlines({ ...input, koufuKetteiDate: "2024-03-01", shuuryouYoteiDate: "2024-05-31" });
    expect(r.jigyouka[0].dueDate).toBe("2024-05-31");
  });
});

describe("制度マスタの整合性", () => {
  it("IDは一意で、全公募回で期限計算が成立する", async () => {
    const { PROGRAM_MASTERS } = await import("./master");
    const ids = PROGRAM_MASTERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PROGRAM_MASTERS) {
      const r = calcDeadlines({
        programId: p.id,
        koufuKetteiDate: "2025-06-20",
        shuuryouYoteiDate: "2026-03-31",
        kessanMonth: 3,
      });
      expect(r.jigyouka).toHaveLength(6);
      expect(r.jisseki.dueDate <= r.completionDeadline.dueDate).toBe(true);
      expect(r.zaisanShobun.endDate > r.zaisanShobun.startDate).toBe(true);
    }
  });

  it("枠・類型で完了期限の月数が変わる(グリーン成長枠/GX進出類型=14ヶ月、グローバル枠=12ヶ月)", async () => {
    const { getProgram } = await import("./master");
    expect(getProgram("saikouchiku-12").jisseki.completionLimitMonths).toBe(12);
    expect(getProgram("saikouchiku-12-gx").jisseki.completionLimitMonths).toBe(14);
    expect(getProgram("saikouchiku-6-green").jisseki.completionLimitMonths).toBe(14);
    expect(getProgram("monozukuri-19").jisseki.completionLimitMonths).toBe(10);
    expect(getProgram("monozukuri-19-global").jisseki.completionLimitMonths).toBe(12);
  });
});

describe("calcDeadlines: 入力バリデーション", () => {
  const input = {
    programId: "saikouchiku-11",
    koufuKetteiDate: "2024-06-20",
    shuuryouYoteiDate: "2025-03-31",
    kessanMonth: 3,
  };

  it("不正な制度ID・決算月・日付順序を拒否する", () => {
    expect(() => calcDeadlines({ ...input, programId: "unknown" })).toThrow("未対応の制度ID");
    expect(() => calcDeadlines({ ...input, kessanMonth: 13 })).toThrow("決算月");
    expect(() =>
      calcDeadlines({ ...input, shuuryouYoteiDate: "2024-01-01" }),
    ).toThrow("交付決定日以降");
  });
});
