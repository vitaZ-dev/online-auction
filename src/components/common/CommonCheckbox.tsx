import { CommonCheckboxStyle } from "../../styles/CommonStyle";
import { CommonCheckboxProps } from "../../types/component";

export default function CommonCheckbox({
  id,
  name = "",
  checked,
  text = "",
  onChange,
  disabled = false,
}: CommonCheckboxProps) {
  return (
    <CommonCheckboxStyle>
      <input
        className="common-input-check"
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="common-input-check" htmlFor={id}>
        {text}
      </label>
    </CommonCheckboxStyle>
  );
}
