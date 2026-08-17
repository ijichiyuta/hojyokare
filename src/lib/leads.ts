import "server-only";

import { getDb } from "./db";
import type { DeadlineInput } from "./subsidy/deadline";

export interface LeadRow {
  id: string;
  email: string;
  program_id: string;
  koufu_kettei_date: string;
  shuuryou_yotei_date: string;
  kessan_month: number;
  created_at: string;
}

export interface SaveLeadResult {
  id: string;
  /** 新規保存なら true(結果メールは新規時のみ送る。リロードでの再送を防ぐ) */
  isNew: boolean;
}

/**
 * チェッカーのリードを保存する(同一条件は重複させない)。
 * DB 未設定・保存失敗でも結果表示は止めない(戻り値 null)。
 */
export async function saveLead(
  email: string,
  input: DeadlineInput,
): Promise<SaveLeadResult | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const match = {
      email,
      program_id: input.programId,
      koufu_kettei_date: input.koufuKetteiDate,
      shuuryou_yotei_date: input.shuuryouYoteiDate,
      kessan_month: input.kessanMonth,
    };
    const { data: existing, error: selectError } = await db
      .from("leads")
      .select("id")
      .match(match)
      .maybeSingle();
    if (selectError) {
      console.error("[leads] 参照に失敗:", selectError.message);
      return null;
    }
    if (existing) {
      await db
        .from("leads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      return { id: existing.id, isNew: false };
    }
    const { data, error } = await db.from("leads").insert(match).select("id").single();
    if (error) {
      console.error("[leads] 保存に失敗:", error.message);
      return null;
    }
    return { id: data.id, isNew: true };
  } catch (e) {
    console.error("[leads] 保存に失敗:", e);
    return null;
  }
}
