/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import defaultImg from "/images/profile_default.png";
import axios from "axios";

export default function Mypage() {
  const [postDB, setPostDB] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get("http://localhost:4000/posts");
      setPostDB(data);

      const filterRes = data.reduce((acc: any[], item: any) => {
        if (item?.user_id.includes(userInfo?.uuid) && acc.length < 6) {
          acc.push(item); // 조건에 맞는 요소를 추가
        }
        return acc; // 누적된 결과 반환
      }, []);
      setUserPost(filterRes);
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
        <div className="sell_list">
          {userPost?.map((item) => {
            return (
              <article key={item?.id}>
                <img src={item?.src} alt="item_image" />
                <div>{item?.category}</div>
                <p>{item?.title}</p>
                <p>{item?.contents}</p>
              </article>
            );
          })}
        </div>
      </section>
    </MypageLayout>
  );
}
