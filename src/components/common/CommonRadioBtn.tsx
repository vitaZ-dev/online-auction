import { CommonRadioBtnStyle } from "../../styles/CommonStyle";

interface CommonRadioBtnProps {
  id: string;
  text: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}
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
