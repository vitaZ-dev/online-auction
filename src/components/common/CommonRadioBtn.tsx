import { CommonRadioBtnStyle } from "../../styles/CommonStyle";
import { CommonRadioBtnProps } from "../../types/component";

export default function CommonRadioBtn({
  text,
  id,
  name,
  value,
  onChange,
  checked,
}: CommonRadioBtnProps) {
  return (
    <CommonRadioBtnStyle>
      <input
        className="common-input-radio"
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        aria-hidden="true"
      />
      <label htmlFor={id} className={checked ? "checked" : ""}>
        {text}
      </label>
    </CommonRadioBtnStyle>
  );
}
