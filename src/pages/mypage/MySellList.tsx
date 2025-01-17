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
        "http://localhost:4000/posts?_sort=-created_at"
      );

      const filterRes = data.filter((item) =>
        item?.user_id.includes(userInfo?.uuid)
      );
      setUserPost(filterRes);
    };

    getUserPostList();
  }, []);

  return (
    <MypageLayout>
      <h1>내가 판매한 물품 목록</h1>

      <br />
      <section>
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
      </section>
    </MypageLayout>
  );
}
