import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemDetailLayout } from "../../styles/AuctionStyle";
import { findCategory } from "../../modules/category";
import useAuthStore from "../../stores/useAuthStore";
import FullSizeImage from "../../components/common/FullSizeImage";

export default function Detail() {
  const [detail, setDetail] = useState([]);
  const [userCheck, setUserCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [openBidding, setOpenBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);

  const { pathname } = useLocation();
  const POST_ID = pathname.split("/")[2];
  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?id=${POST_ID}`
    );
    setDetail(data);
    setUserCheck(data[0].user_id === userInfo?.uuid);

    setBidHistory(data[0]?.bid_history || []);
    if (data[0]?.bid_history?.length) {
      const maxAmount = data[0].bid_history.reduce((max, current) =>
        current.amount > max.amount ? current : max
      );
      setBidAmount(maxAmount?.amount);
    } else setBidAmount(data[0]?.start_price || 0);
    setBidAmount(data[0]?.now_price || data[0]?.start_price || 0);
  };

  const openComponent = () => setShow(true);

  const editPost = () => navigate(`/sell/${POST_ID}`);

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:4000/posts/${POST_ID}`);
      alert("게시글 삭제가 완료되었습니다!");
      navigate("/auction");
    } catch (error) {
      console.log(error);
      alert("게시글 삭제에 실패했습니다!");
    }
  };

  const auctionBidding = async () => {
    if (bidAmount < detail[0].now_price) {
      alert("입찰가는 현대최대가 보다 높은 값만 입력할 수 있습니다!");
      return false;
    }

    try {
      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        now_price: bidAmount,
        bid_count: bidHistory.length + 1,
        bid_history: [
          {
            amount: bidAmount,
            bidder: userInfo?.nickname || "USER",
            time: new Date(),
            uuid: userInfo?.uuid,
          },
          ...bidHistory,
        ],
      });
      alert("입찰 완료!");
      setOpenBidding(false);
      await fetchPosts();
    } catch (error) {
      console.log(error);
      alert("입찰에 실패했습니다!");
    }
  };

  return (
    <ItemDetailLayout>
      {/* 제품 */}
      {detail?.map((item) => {
        return (
          <section key={item.id}>
            <div className="item_img" onClick={openComponent}>
              <div className="img_wrap">
                <img src={item.src} alt="image" />
              </div>
            </div>
            {show && <FullSizeImage src={item?.src} setShow={setShow} />}
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
              <h3>품목 세부 정보</h3>
              {/* <p>카테고리/시작가격/시작날짜/종료날짜</p> */}
              <p>
                카테고리 | {findCategory(item?.category_id)} <br />
                시작가 | {item?.start_price}원 <br />
                입찰횟수 | {item?.bid_count} <br />
                현재최대가 | {item?.now_price} <br />
                마감일 | {item?.end_date} (1/15(수) 14:00 KST 순차마감)
              </p>
            </section>
            {userCheck || (
              <>
                <button onClick={() => setOpenBidding(!openBidding)}>
                  {openBidding ? <>닫기</> : <>입찰하기</>}
                </button>
              </>
            )}
            {openBidding && (
              <section>
                가격을 입력해주세요! <br />* 한 번 입찰하면 취소할 수 없습니다!
                <br />
                <input
                  type="number"
                  min={item?.start_price}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
                <button onClick={() => auctionBidding()}>입찰하기</button>
              </section>
            )}
            <section>
              <h4>상세내용</h4>
              <p>{item.contents}</p>
            </section>
            <section>
              <h3>입찰 내역</h3>
              <p>입찰자 닉네임/입찰가격/입찰일</p>
              {bidHistory.length ? (
                bidHistory?.map((item, idx) => (
                  <div key={idx}>
                    {item?.bidder} / {item?.amount} / {item?.time}
                  </div>
                ))
              ) : (
                <div>입찰자가 없습니다</div>
              )}
            </section>
          </section>
        );
      })}
      {/* 다른내용 */}
      <section></section>
    </ItemDetailLayout>
  );
}
