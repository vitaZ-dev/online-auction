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
import { Pagination, Stack } from "@mui/material";

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
      <CommonTitle type={1} title={`${userInfo?.nickname} 님의 입찰 내역들`} />

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                variant="outlined"
                color="secondary"
                onChange={(_, changePage) => setPage(changePage)}
              />
            </Stack>
          </div>
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
