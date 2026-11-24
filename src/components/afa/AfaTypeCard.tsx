import type { AfaTypeDef } from "@/components/afa/afa-types";

type AfaTypeCardProps = {
  type: AfaTypeDef;
  selected: boolean;
  onSelect: () => void;
};

export default function AfaTypeCard({ type, selected, onSelect }: AfaTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex items-start gap-4 rounded-[14px] border-2 p-[22px] text-left text-[17px] text-flow-text transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-flow-navy/40 hover:shadow-[0_6px_16px_rgba(14,42,71,0.10)] ${
        selected
          ? "border-flow-navy bg-flow-info-bg shadow-[0_2px_8px_rgba(14,42,71,0.12)]"
          : "border-flow-border bg-white"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${selected ? "bg-flow-navy" : "bg-flow-info-bg group-hover:bg-flow-navy/10"}`}
      >
        {type.icon(selected ? "#fff" : "#0E2A47")}
      </span>
      <span>
        <b className="block text-[19px] text-flow-navy">{type.label}</b>
        <span className="text-flow-muted">{type.description}</span>
        {selected && <span className="mt-2 block text-sm font-bold text-flow-green">✓ Selected</span>}
      </span>
    </button>
  );
}
