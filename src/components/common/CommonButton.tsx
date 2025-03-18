import { CommonButtonStyle } from "../../styles/CommonStyle";
import { CommonButtonProps } from "../../types/component";

export default function CommonButton({
  text = "",
  btnType = "large",
  bgColor = "white",
  textColor = "#d974eb",
  onClick,
  disabled,
  children,
}: CommonButtonProps) {
  return (
    <CommonButtonStyle
      className={btnType}
      bgColor={bgColor}
      textColor={textColor}
      onClick={onClick}
      disabled={disabled}
    >
      <>{text || children}</>
    </CommonButtonStyle>
  );
}
