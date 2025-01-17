import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ItemDetailLayout } from "../../styles/AuctionStyle";
import { findCategory } from "../../modules/category";

export default function Detail() {
  const [detail, setDetail] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `http://localhost:4000/posts?id=${pathname.split("/")[2]}`
      );
      setDetail(response.data);
      console.log(response.data[0]);
    };
    fetchPosts();
  }, []);

  return (
    <ItemDetailLayout>
      {/* 제품 */}
      {detail?.map((item) => {
        return (
          <section key={item.id}>
            <div className="item_img">
              <img src={item.src} alt="image" />
            </div>
            <h2>{item.user_info}</h2>
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
                카테고리 | 일반 <br />
                시작가 | 0원 <br />
                입찰인원 | ?? <br />
                현재가 | ?? <br />
                마감일 | 1/15(수) 14:00 KST 순차마감
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
