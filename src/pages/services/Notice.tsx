import { NoticeLayout } from "../../styles/ServiceStyle";
import CommonTitle from "../../components/common/CommonTitle";
import { CommonPaddingBox } from "../../styles/CommonStyle";

export default function Notice() {
  return (
    <NoticeLayout>
      <CommonTitle type={1} title="공지사항" />
      <CommonPaddingBox>준비중입니다</CommonPaddingBox>
    </NoticeLayout>
  );
}
