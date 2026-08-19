"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="cursor-pointer rounded border border-border-input bg-white px-[22px] py-[13px] text-sm hover:border-navy"
    >
      PDFで保存
    </button>
  );
}
