/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import axios from "axios";
import { findCategory } from "../../modules/category";
import { Link } from "react-router-dom";

export default function MySellList() {
  const [userPost, setUserPost] = useState([]);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const getUserPostList = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?user_id=${userInfo?.uuid}&_sort=-created_at`
      );
      setUserPost(data);
    };

    getUserPostList();
  }, []);

  return (
    <MypageLayout>
      <h1>내가 판매한 물품 목록</h1>

      <br />
      <section>
        {userPost.length ? (
          <div className="sell_list">
            {userPost?.map((item) => {
              return (
                <Link to={`/auction/${item?.id}`} key={item?.id}>
                  <article>
                    <img src={item?.src} alt="item_image" />
                    <div>{findCategory(item?.category_id)}</div>
                    <p className="title">{item?.title}</p>
                    <p className="contents">{item?.contents}</p>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>내가 판매한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
