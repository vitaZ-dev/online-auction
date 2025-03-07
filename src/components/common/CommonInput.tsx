import { CommonInputStyle } from "../../styles/CommonStyle";

interface CommonInputProps {
  id?: string;
  length?: string;
  min?: number;
  maxLength?: number;
  disabled?: boolean;
  type: string;
  placeholder?: string;
  value: string | number;
  setValue: React.ChangeEventHandler<HTMLInputElement>;
}

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
