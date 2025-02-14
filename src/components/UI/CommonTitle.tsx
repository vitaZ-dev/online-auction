import { useNavigate } from "react-router-dom";
import { CommonTitleStyle } from "../../styles/CommonStyle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function CommonTitle({
  type = 1,
  title = "TITLE",
  link = "",
  linkProps = {},
  linkTitle = "더 보기",
}: {
  type: number;
  title: string;
  link?: string | false;
  linkProps?: object;
  linkTitle?: string;
}) {
  const navigate = useNavigate();

  const titleTag = {
    1: <h1>{title}</h1>,
    2: <h2>{title}</h2>,
    3: <h3>{title}</h3>,
    4: <h4>{title}</h4>,
    5: <h5>{title}</h5>,
    6: <h6>{title}</h6>,
  };

  return (
    <CommonTitleStyle>
      {titleTag[type]}
      {link && (
        <div className="link_text" onClick={() => navigate(link, linkProps)}>
          {linkTitle}
          <KeyboardArrowRightIcon />
        </div>
      )}
    </CommonTitleStyle>
  );
}
