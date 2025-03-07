import { CommonTextareaStyle } from "../../styles/CommonStyle";

interface CommonTextareaProps {
  id?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  setValue: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function CommonTextarea({
  id,
  maxLength,
  disabled,
  placeholder,
  value,
  setValue,
}: CommonTextareaProps) {
  return (
    <CommonTextareaStyle>
      <textarea
        className="common-input"
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>
    </CommonTextareaStyle>
  );
}
