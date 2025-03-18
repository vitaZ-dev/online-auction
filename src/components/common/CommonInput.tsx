import { CommonInputStyle } from "../../styles/CommonStyle";
import { CommonInputProps } from "../../types/component";

export default function CommonInput({
  id,
  length = "full",
  min,
  maxLength,
  disabled,
  type,
  placeholder,
  value,
  setValue,
}: CommonInputProps) {
  return (
    <CommonInputStyle length={length}>
      <input
        className="common-input"
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        value={value}
        onChange={setValue}
        autoComplete="off"
      />
    </CommonInputStyle>
  );
}
