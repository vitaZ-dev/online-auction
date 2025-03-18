import { CommonTextareaStyle } from "../../styles/CommonStyle";
import { CommonTextareaProps } from "../../types/component";

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
        onChange={setValue}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>
    </CommonTextareaStyle>
  );
}
