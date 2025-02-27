import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import axios from "axios";
import { Pagination, Stack } from "@mui/material";

export default function MyFavoriteList() {
  const { userInfo, favorite } = useAuthStore();

  const [userFavorite, setUserFavorite] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    getFavorite();
  }, [page]);

  const getFavorite = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/favorite?uuid=${userInfo?.uuid}&_sort=-created_at&_page=${page}&_per_page=16`
    );
    setUserFavorite(data.data);
    setTotalPage(data.pages);
  };

  return (
    <MypageLayout>
      <CommonTitle
        type={1}
        title={`${userInfo?.nickname} 님의 좋아요 리스트`}
      />

      <section>
        {userFavorite?.length ? (
          <>
            <CommonList grid={4}>
              {userFavorite?.map((post) => {
                return (
                  <Link to={`/auction/${post?.item_id}`} key={post?.item_id}>
                    <CommonListItem
                      src={post?.src}
                      category={findCategory(post?.category_id)}
                      title={post?.title}
                      startPrice={post?.start_price}
                      isOpen={post.is_open}
                    />
                  </Link>
                );
              })}
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
          <p>내가 좋아요 한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
