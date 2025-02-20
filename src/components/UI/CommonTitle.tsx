import { useNavigate } from "react-router-dom";
import { CommonTitleStyle } from "../../styles/CommonStyle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function CommonTitle({
  type = 1,
  title = "TITLE",
  isOpen = true,
  link = "",
  linkProps = {},
  linkTitle = "더 보기",
}: {
  type: number;
  title: string;
  isOpen?: boolean;
  link?: string | false;
  linkProps?: object;
  linkTitle?: string;
}) {
  const navigate = useNavigate();

  const titleTag = {
    1: <h1 className="title_tag">{title}</h1>,
    2: <h2 className="title_tag">{title}</h2>,
    3: <h3 className="title_tag">{title}</h3>,
    4: <h4 className="title_tag">{title}</h4>,
    5: <h5 className="title_tag">{title}</h5>,
    6: <h6 className="title_tag">{title}</h6>,
  };

  return (
    <CommonTitleStyle>
      <div className="title_text">
        {!isOpen && <span className="closed">판매완료</span>}
        {titleTag[type]}
      </div>
      {link && (
        <div className="link_text" onClick={() => navigate(link, linkProps)}>
          {linkTitle}
          <KeyboardArrowRightIcon />
        </div>
      )}
    </CommonTitleStyle>
  );
}
