import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonModal from "../../components/common/CommonModal";
import ShowListTable from "../../components/UI/ShowListTable";
import { useNavigate } from "react-router-dom";
import CallMadeIcon from "@mui/icons-material/CallMade";
import api from "../../apis/api";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CommonNodataBox } from "../../styles/CommonStyle";
import MUIPagination from "../../components/common/MUIPagination";
import CommonButton from "../../components/common/CommonButton";
import { BidListHistoryType, BidListType } from "../../types/user";

export default function MyBidList() {
  const { userInfo } = useAuthStore();

  const [bidListAll, setBidListAll] = useState<Array<BidListType> | []>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const [toggle, setToggle] = useState<boolean>(false);
  const [detailID, setDetailId] = useState<string>("");
  const [detailTitle, setDetailTitle] = useState<string>("");
  const [bidContents, setBidContents] = useState<
    Array<BidListHistoryType> | []
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    getUserPostList(page);
  }, [page]);

  const getUserPostList = async (page: number) => {
    const { data, headers } = await api.get(
      `bid_list?uuid=${userInfo?.uuid}&_sort=time&_order=desc&_page=${page}&_per_page=16`
    );
    setBidListAll(data);
    const totalPageCal =
      +headers["x-total-count"] > 16
        ? Math.ceil(+headers["x-total-count"] / 16)
        : 1;
    setTotalPage(totalPageCal);
  };

  const handleDetailBid = (idx: number, item_id: string, title: string) => {
    setDetailId(item_id);
    setDetailTitle(title);
    setBidContents(bidListAll[idx]?.history);
    setToggle(true);
  };

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => navigate("/mypage")}
        />
        <CommonTitle
          type={1}
          title={`${userInfo?.nickname} 님의 입찰 내역들`}
        />
      </div>

      {bidListAll?.length ? (
        <>
          <CommonList grid={4}>
            {bidListAll?.map((item, idx) => (
              <div
                key={item?.id}
                onClick={() => handleDetailBid(idx, item.item_id, item.title)}
              >
                {/* <Link to={`/auction/${item?.id}`} key={item?.id}> */}
                <CommonListItem
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                />
                {/* </Link> */}
              </div>
            ))}
          </CommonList>
          <MUIPagination totalPage={totalPage} setPage={setPage} />
        </>
      ) : (
        <CommonNodataBox>나의 입찰 내역이 없습니다.</CommonNodataBox>
      )}
      <CommonModal
        isOpen={toggle}
        modalTitle={detailTitle}
        setDisplay={setToggle}
      >
        <ShowListTable
          tableGrid={[2, 4]}
          tableHeader={["amount", "time"]}
          tableHeaderText={["입찰가", "입찰 시간"]}
          tableList={bidContents}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            btnType="small"
            textColor="#181818"
            onClick={() => navigate(`/auction/${detailID}`)}
          >
            <div style={{ fontSize: 14 }}>사이트로</div>
            <CallMadeIcon style={{ fontSize: 18 }} />
          </CommonButton>
        </div>
      </CommonModal>
    </MypageLayout>
  );
}
