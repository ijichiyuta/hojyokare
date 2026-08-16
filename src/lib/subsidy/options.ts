import { PROGRAM_MASTERS } from "./master";

export interface SubsidyGroup {
  name: string;
  programs: { id: string; roundLabel: string }[];
}

/** チェッカーの「補助金種別 → 公募回」2段セレクト用に制度マスタをグループ化する */
export function subsidyGroups(): SubsidyGroup[] {
  const groups: SubsidyGroup[] = [];
  for (const p of PROGRAM_MASTERS) {
    let group = groups.find((g) => g.name === p.subsidyName);
    if (!group) {
      group = { name: p.subsidyName, programs: [] };
      groups.push(group);
    }
    group.programs.push({ id: p.id, roundLabel: p.roundLabel });
  }
  return groups;
}
