/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import defaultImg from "/images/profile_default.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { findCategory } from "../../modules/category";

export default function Mypage() {
  const [userPost, setUserPost] = useState([]);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?user_id=${userInfo?.uuid}&_sort=-created_at`
      );

      const filterPost = data.reduce((acc: any[], item: any) => {
        if (acc.length < 6) acc.push(item);
        return acc;
      }, []);
      setUserPost(filterPost);
    };

    fetchPosts();
  }, []);

  return (
    <MypageLayout>
      <h1>Mypage</h1>
      <hr />
      <img
        src={defaultImg}
        alt="default_image"
        style={{ width: "200px", height: "200px" }}
      />
      <p>어서오세요, {userInfo?.nickname} 님</p>

      <br />
      <section>
        <h3>최근 판매 물품 목록</h3>
        {userPost.length ? (
          <>
            <div className="sell_list">
              {userPost?.map((item) => {
                return (
                  <Link to={`/auction/${item?.id}`} key={item?.id}>
                    <article>
                      <img src={item?.src} alt="item_image" />
                      <div>{findCategory(item?.category_id)}</div>
                      <p>{item?.title}</p>
                      <p>{item?.contents}</p>
                    </article>
                  </Link>
                );
              })}
            </div>
            <Link to="list">더 보기 〉</Link>
          </>
        ) : (
          <>
            <div>판매한 물품이 없습니다</div>
            <Link to="/sell">판매글 작성하러 가기 〉</Link>
          </>
        )}
      </section>
    </MypageLayout>
  );
}
