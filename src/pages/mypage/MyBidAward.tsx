import axios from "axios";
import { useEffect, useState } from "react";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonTitle from "../../components/UI/CommonTitle";
import useAuthStore from "../../stores/useAuthStore";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import { Link } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";

export default function MyBidAward() {
  const [awardList, setAwardList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { userInfo } = useAuthStore();

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
      <CommonTitle type={1} title={`${userInfo?.nickname} 님의 낙찰 내역`} />

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
        <>
          <div>낙찰 내역이 없습니다</div>
        </>
      )}
    </MypageLayout>
  );
}
