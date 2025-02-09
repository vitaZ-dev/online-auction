import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import axios from "axios";
import { findCategory } from "../../modules/category";
import { Link, useLocation } from "react-router-dom";
import ListPerItem from "../../components/ListPerItem";
import { AuctionListLayout } from "../../styles/CommonStyle";

export default function MySellList() {
  const [userPostAll, setUserPostAll] = useState([]);
  const { userInfo } = useAuthStore();
  const { state } = useLocation();
  const USER_ID = state?.uuid ?? userInfo?.uuid;

  useEffect(() => {
    getUserPostList();
  }, []);

  const getUserPostList = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?user_id=${USER_ID}&_sort=-created_at`
    );
    setUserPostAll(data);
  };

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

  return (
    <MypageLayout>
      <h1>{state?.nickname ?? userInfo.nickname} 님이 판매한 물품 목록</h1>

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
          <AuctionListLayout grid={4}>
            {userPostAll?.map((post) => {
              return (
                <Link to={`/auction/${post?.id}`} key={post?.id}>
                  <ListPerItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    startPrice={post?.start_price}
                  />
                </Link>
              );
            })}
          </AuctionListLayout>
        ) : (
          <p>내가 판매한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
