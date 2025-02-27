import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import axios from "axios";
import { findCategory } from "../../modules/category";
import { Link, useLocation } from "react-router-dom";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import CommonTitle from "../../components/UI/CommonTitle";
import { Pagination, Stack } from "@mui/material";

export default function MySellList() {
  const [userPostAll, setUserPostAll] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { userInfo } = useAuthStore();

  const { state } = useLocation();
  const USER_ID = state?.uuid ?? userInfo?.uuid;

  useEffect(() => {
    getUserPostList(page);
  }, [page]);

  const getUserPostList = async (page: number) => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?user_id=${USER_ID}&_sort=-created_at&_page=${page}&_per_page=16`
    );
    setUserPostAll(data.data);
    setTotalPage(data.pages);
  };

  /*
  const getUserPostOpenList = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?user_id=${USER_ID}&_sort=-created_at&is_open=1`
    );
  };

  const getUserPostEndList = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?user_id=${USER_ID}&_sort=-created_at&is_open=0`
    );
  };
  */

  return (
    <MypageLayout>
      <CommonTitle
        type={1}
        title={`${state?.nickname ?? userInfo.nickname} 님이 판매한 물품 목록`}
      />

      <br />

      <div style={{ display: "flex", gap: "12px" }}>
        <button style={{ border: "1px solid gray", padding: "4px 8px" }}>
          all
        </button>
        <button style={{ border: "1px solid gray", padding: "4px 8px" }}>
          open
        </button>
        <button style={{ border: "1px solid gray", padding: "4px 8px" }}>
          end
        </button>
      </div>
      <section>
        {userPostAll.length ? (
          <>
            <CommonList grid={4}>
              {userPostAll?.map((post) => {
                return (
                  <Link to={`/auction/${post?.id}`} key={post?.id}>
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
          <p>내가 판매한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
