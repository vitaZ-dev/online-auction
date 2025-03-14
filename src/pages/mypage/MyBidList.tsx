import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonModal from "../../components/common/CommonModal";
import ShowListTable from "../../components/ShowListTable";
import { useNavigate } from "react-router-dom";
import CallMadeIcon from "@mui/icons-material/CallMade";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CommonNodataBox } from "../../styles/CommonStyle";
import MUIPagination from "../../components/common/MUIPagination";
import CommonButton from "../../components/common/CommonButton";

export default function MyBidList() {
  const { userInfo } = useAuthStore();

  const [bidListAll, setBidListAll] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [toggle, setToggle] = useState(false);
  const [detailID, setDetailId] = useState("");
  const [detailTitle, setDetailTitle] = useState("");
  const [bidContents, setBidContents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getUserPostList(page);
  }, [page]);

  const getUserPostList = async (page: number) => {
    const { data } = await axios.get(
      `http://localhost:4000/bid_list?uuid=${userInfo.uuid}&_sort=-created_at&_page=${page}&_per_page=16`
    );
    setBidListAll(data.data);
    setTotalPage(data.pages);
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
                  isOpen={item.is_open}
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
