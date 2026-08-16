"use client";

import { useState } from "react";

import type { SubsidyGroup } from "@/lib/subsidy/options";

interface Props {
  groups: SubsidyGroup[];
  defaults: { program?: string; koufu?: string; kessan?: string };
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const inputClass =
  "tnum h-11 w-full max-w-[420px] rounded border border-border-input px-3 text-sm bg-white";

function FieldRow({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[190px_1fr] items-start gap-6 border-b border-line-soft py-[18px]">
      <div className="pt-[11px]">
        <div className="flex items-center gap-2">
          <label htmlFor={htmlFor} className="text-sm font-medium">
            {label}
          </label>
          <span className="rounded-sm border border-danger-line px-[5px] py-px text-[10px] text-danger">
            必須
          </span>
        </div>
      </div>
      <div>
        {children}
        <div className="mt-2 text-xs leading-[1.7] text-soft">{hint}</div>
      </div>
    </div>
  );
}

export function CheckerForm({ groups, defaults }: Props) {
  const initialProgram =
    groups.flatMap((g) => g.programs).find((p) => p.id === defaults.program)?.id ??
    groups[0].programs[0].id;
  const initialGroup =
    groups.find((g) => g.programs.some((p) => p.id === initialProgram)) ?? groups[0];

  const [groupName, setGroupName] = useState(initialGroup.name);
  const [programId, setProgramId] = useState(initialProgram);
  const [koufu, setKoufu] = useState(defaults.koufu ?? "");

  const group = groups.find((g) => g.name === groupName) ?? groups[0];
  const isMonozukuri = groupName.includes("ものづくり");

  return (
    <form action="/checker/result" method="get" className="p-8">
      <FieldRow
        label="補助金種別"
        htmlFor="subsidy"
        hint="事業再構築補助金・ものづくり補助金に対応しています"
      >
        <select
          id="subsidy"
          value={groupName}
          onChange={(e) => {
            const next = groups.find((g) => g.name === e.target.value) ?? groups[0];
            setGroupName(next.name);
            setProgramId(next.programs[0].id);
          }}
          className={inputClass}
        >
          {groups.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow
        label="公募回"
        htmlFor="program"
        hint="交付決定通知書に記載の公募回を選択してください"
      >
        <select
          id="program"
          name="program"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          className={inputClass}
        >
          {group.programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.roundLabel}
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow label="交付決定日" htmlFor="koufu" hint="交付決定通知書に記載の日付です">
        <input
          id="koufu"
          type="date"
          name="koufu"
          required
          value={koufu}
          onChange={(e) => setKoufu(e.target.value)}
          className={inputClass}
        />
      </FieldRow>

      <FieldRow
        label="補助事業終了予定日"
        htmlFor="yotei"
        hint="実績報告の起算となる完了予定日です"
      >
        <input
          id="yotei"
          type="date"
          name="yotei"
          required
          min={koufu || undefined}
          className={inputClass}
        />
      </FieldRow>

      <FieldRow
        label="決算月"
        htmlFor="kessan"
        hint={
          isMonozukuri
            ? "ものづくり補助金の事業化状況報告は毎年4月1日〜5月31日のため、決算月は期限に影響しません"
            : "事業化状況報告の期限は決算日の3ヶ月後です"
        }
      >
        <select id="kessan" name="kessan" defaultValue={defaults.kessan ?? "3"} className={inputClass}>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}月
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow
        label="メールアドレス"
        htmlFor="email"
        hint="計算結果と30日前アラートをお送りします"
      >
        <input
          id="email"
          type="email"
          name="email"
          required
          placeholder="taro@example.co.jp"
          className={inputClass}
        />
      </FieldRow>

      <div className="mt-7 flex items-center justify-between gap-6">
        <p className="max-w-[34em] text-xs leading-[1.8] text-soft">
          事務局から個別に通知がある場合はそちらが優先されます。入力いただいたメールアドレスは結果送付と関連する案内にのみ使用します。
        </p>
        <button
          type="submit"
          className="cursor-pointer whitespace-nowrap rounded bg-navy px-10 py-[15px] text-[15px] font-medium text-white hover:bg-navy-hover"
        >
          期限を計算する
        </button>
      </div>
    </form>
  );
}
