import { CommonButtonStyle } from "../../styles/CommonStyle";

interface CommonButtonProps {
  text?: string;
  btnType: "small" | "medium" | "large";
  bgColor?: string;
  textColor?: string;
  onClick: VoidFunction;
  disabled?: boolean;
  children?: any;
}
export default function CommonButton({
  text = "",
  btnType = "large",
  bgColor = "white",
  textColor = "pink",
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
