import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemDetailLayout } from "../../styles/AuctionStyle";
import { findCategory } from "../../modules/category";
import useAuthStore from "../../stores/useAuthStore";

export default function Detail() {
  const [detail, setDetail] = useState([]);
  const [userCheck, setUserCheck] = useState(false);
  const { pathname } = useLocation();
  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?id=${pathname.split("/")[2]}`
      );
      setDetail(data);
      setUserCheck(data[0].user_id === userInfo?.uuid);
    };

    fetchPosts();
  }, []);

  const editPost = () => {
    console.log("게시글 수정 - 페이지 이동");
  };
  const deletePost = async () => {
    console.log("게시글 삭제");
    try {
      await axios.delete(
        `http://localhost:4000/posts/${pathname.split("/")[2]}`
      );
      alert("게시글 삭제가 완료되었습니다!");
      navigate("/auction");
    } catch (error) {
      console.log(error);
      alert("게시글 삭제에 실패했습니다!");
    }
  };

  return (
    <ItemDetailLayout>
      {/* 제품 */}
      {detail?.map((item) => {
        return (
          <section key={item.id}>
            <div className="item_img">
              <img src={item.src} alt="image" />
            </div>
            <div className="user_info">
              <h2>{item.user_info}</h2>
              {userCheck && (
                <div className="user_utils">
                  <button onClick={() => editPost()}>수정</button>
                  <button onClick={() => deletePost()}>삭제</button>
                </div>
              )}
            </div>
            <hr />
            <p>{findCategory(item?.category_id)}</p>
            <h1>{item.title}</h1>
            <p>{item.start_date}</p>
            {/* <div className="item_info">
              <div>
                <p>현재 입찰가</p>
                <p>{item.now_price || "no bid"}</p>
              </div>
              <div>
                <p>총 입찰</p>
                <p>{item.bid}</p>
              </div>
              <div>
                <p>종료일</p>
                <p>{item.end_date}</p>
              </div>
            </div> */}

            <section>
              <p>품목 세부 정보</p>
              {/* <p>카테고리/시작가격/시작날짜/종료날짜</p> */}
              <p>
                카테고리 | {findCategory(item?.category_id)} <br />
                시작가 | {item?.start_price}원 <br />
                입찰인원 | {item?.bid} <br />
                현재가 | {item?.now_price} <br />
                마감일 | {item?.end_date} (1/15(수) 14:00 KST 순차마감)
              </p>
            </section>
            <button>입찰하기</button>
            <section>
              <p>상세내용</p>
              <p>{item.contents}</p>
            </section>
            <section>
              <p>입찰 내역</p>
              <p>입찰자 닉네임/입찰일/입찰 가격</p>
            </section>
          </section>
        );
      })}
      {/* 다른내용 */}
      <section></section>
    </ItemDetailLayout>
  );
}
