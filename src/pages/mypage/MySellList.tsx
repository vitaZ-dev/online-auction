/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import axios from "axios";
import { findCategory } from "../../modules/category";
import { Link, useLocation } from "react-router-dom";
import ListPerItem from "../../components/ListPerItem";
import { AuctionListLayout } from "../../styles/CommonStyle";

export default function MySellList() {
  const [userPost, setUserPost] = useState([]);
  const { userInfo } = useAuthStore();
  const { state } = useLocation();

  useEffect(() => {
    const getUserPostList = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?user_id=${
          state?.uuid ?? userInfo?.uuid
        }&_sort=-created_at`
      );
      setUserPost(data);
    };

    getUserPostList();
  }, []);

  return (
    <MypageLayout>
      <h1>{state?.nickname ?? userInfo.nickname} 님이 판매한 물품 목록</h1>

      <br />
      <section>
        {userPost.length ? (
          <AuctionListLayout grid={4}>
            {userPost?.map((post) => {
              return (
                <Link to={`/auction/${post?.id}`} key={post?.id}>
                  <ListPerItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    contents={post?.contents}
                  />
                  {/* <article>
                    <img src={post?.src} alt="item_image" />
                    <div>{findCategory(post?.category_id)}</div>
                    <p className="title">{post?.title}</p>
                    <p className="contents">{post?.contents}</p>
                  </article> */}
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
