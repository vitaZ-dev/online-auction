import axios from "axios";
import { useEffect, useState } from "react";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonTitle from "../../components/UI/CommonTitle";
import useAuthStore from "../../stores/useAuthStore";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import { Link, useNavigate } from "react-router-dom";
import MUIPagination from "../../components/common/MUIPagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CommonNodataBox } from "../../styles/CommonStyle";
import { BidAwardType } from "../../types/user";

export default function MyBidAward() {
  const [awardList, setAwardList] = useState<Array<BidAwardType> | []>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getUserPostList(page);
  }, [page]);

  const getUserPostList = async (page: number) => {
    const { data } = await axios.get(
      `http://localhost:4000/bid_award?uuid=${userInfo.uuid}&_sort=-created_at&_page=${page}&_per_page=16`
    );
    setAwardList(data.data);
    setTotalPage(data.pages);
  };

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => navigate("/mypage")}
        />
        <CommonTitle type={1} title={`${userInfo?.nickname} 님의 낙찰 내역`} />
      </div>

      {awardList?.length ? (
        <>
          <CommonList grid={4}>
            {awardList?.map((item, idx) => (
              <div key={idx}>
                <Link to={`/auction/${item?.item_id}`} key={idx}>
                  <CommonListItem
                    src={item?.src}
                    category={findCategory(item?.category_id)}
                    title={item?.title}
                    startPrice={item?.amount}
                    isOpen={false}
                  />
                </Link>
              </div>
            ))}
          </CommonList>
          <MUIPagination totalPage={totalPage} setPage={setPage} />
        </>
      ) : (
        <>
          <CommonNodataBox>낙찰 내역이 없습니다</CommonNodataBox>
        </>
      )}
    </MypageLayout>
  );
}
