import type { ReactNode } from "react";

type FieldTone = "default" | "error";

type BaseProps = {
  id: string;
  label: string;
  tone?: FieldTone;
  helper?: ReactNode;
  className?: string;
};

type InputFieldProps = BaseProps & {
  as?: "input";
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};

type TextareaFieldProps = BaseProps & {
  as: "textarea";
  value: string;
  onChange?: (value: string) => void;
  rows?: number;
  readOnly?: boolean;
};

type DisplayFieldProps = BaseProps & {
  as: "display";
  trailing?: ReactNode;
  children: ReactNode;
};

type FieldProps = InputFieldProps | TextareaFieldProps | DisplayFieldProps;

const fieldBorder = "rounded-flow-control border-2 text-[17px]";

export default function Field(props: FieldProps) {
  const { id, label, tone = "default", helper, className = "" } = props;
  const labelClasses = `mb-1.5 block font-semibold ${tone === "error" ? "text-flow-red-text" : ""}`;

  if (props.as === "display") {
    return (
      <div className={className}>
        <div className={labelClasses}>{label}</div>
        <div className="flex h-[52px] items-center justify-between rounded-flow-control bg-flow-info-bg py-0 pl-4 pr-2">
          <b className="text-flow-navy">{props.children}</b>
          {props.trailing}
        </div>
        {helper && <div className="mt-1 text-sm text-flow-muted">{helper}</div>}
      </div>
    );
  }

  const toneClasses =
    tone === "error"
      ? "border-flow-red bg-flow-red-bg"
      : "border-flow-field-border bg-white focus:border-flow-navy";

  if (props.as === "textarea") {
    return (
      <div className={className}>
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
        <textarea
          id={id}
          rows={props.rows ?? 4}
          value={props.value}
          readOnly={props.readOnly}
          onChange={(e) => props.onChange?.(e.target.value)}
          className={`w-full resize-none px-3.5 py-3 font-sans leading-[1.5] outline-none ${fieldBorder} ${toneClasses}`}
        />
        {helper && <div className="mt-1 text-sm text-flow-muted">{helper}</div>}
      </div>
    );
  }

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        onChange={(e) => props.onChange?.(e.target.value)}
        className={`h-[52px] w-full px-3.5 outline-none ${fieldBorder} ${toneClasses}`}
      />
      {helper && <div className="mt-1 text-sm text-flow-muted">{helper}</div>}
    </div>
  );
}
