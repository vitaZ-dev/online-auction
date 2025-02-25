import { useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import ListPerItem from "../../components/ListPerItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonModal from "../../components/common/CommonModal";
import ShowListTable from "../../components/ShowListTable";
import { useNavigate } from "react-router-dom";
import CallMadeIcon from "@mui/icons-material/CallMade";

export default function MyBidList() {
  const { userInfo, bidHistory, bidList } = useAuthStore();

  const [toggle, setToggle] = useState(false);
  const [detailID, setDetailId] = useState("");
  const [detailTitle, setDetailTitle] = useState("");
  const [bidContents, setBidContents] = useState([]);

  const navigate = useNavigate();

  const handleDetailBid = (id: string, title: string) => {
    const re = bidHistory.filter((item) => item.id === id);
    setDetailId(id);
    setBidContents(re);
    setDetailTitle(title);
    setToggle(true);
  };

  return (
    <MypageLayout>
      <CommonTitle type={1} title={`${userInfo?.nickname} 님의 입찰 내역들`} />

      {bidList?.length ? (
        <>
          <CommonList grid={4}>
            {bidList?.map((item) => (
              <div
                key={item?.id}
                onClick={() => handleDetailBid(item.id, item.title)}
              >
                {/* <Link to={`/auction/${item?.id}`} key={item?.id}> */}
                <ListPerItem
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                />
                {/* </Link> */}
              </div>
            ))}
          </CommonList>
        </>
      ) : (
        <div>나의 입찰 내역이 없습니다.</div>
      )}
      {toggle && (
        <CommonModal modalTitle={detailTitle} setDisplay={setToggle}>
          <ShowListTable
            tableGrid={[2, 4]}
            tableHeader={["amount", "time"]}
            tableList={bidContents}
          />
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => navigate(`/auction/${detailID}`)}
              style={{ border: "1px solid red" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>사이트로</span>
                <CallMadeIcon style={{ fontSize: 18 }} />
              </div>
            </button>
          </div>
        </CommonModal>
      )}
    </MypageLayout>
  );
}
