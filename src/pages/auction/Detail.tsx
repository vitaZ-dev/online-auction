import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ItemDetailLayout } from "../../styles/AuctionStyle";
import { findCategory } from "../../modules/category";
import useAuthStore from "../../stores/useAuthStore";
import FullSizeImage from "../../components/common/FullSizeImage";
import { useCookies } from "react-cookie";
import { setDateTemp } from "../../modules";
import ListPerItem from "../../components/ListPerItem";
import { AuctionListLayout, CommonPaddingBox } from "../../styles/CommonStyle";
import ShowListTable from "../../components/ShowListTable";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonCategoryBadge from "../../components/UI/CommonCategoryBadge";

export default function Detail() {
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState([]);
  const [userCheck, setUserCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [favoriteCnt, setFavoriteCnt] = useState(0);
  const [favoriteCheck, setFavoriteCheck] = useState(false);
  const [openBidding, setOpenBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidHistoryDetail, setBidHistoryDetail] = useState([]);

  const [sellList, setSellList] = useState([]);

  const { pathname } = useLocation();
  const POST_ID = pathname.split("/")[2];
  const {
    isLogin,
    userInfo,
    favorite,
    bidHistory,
    bidList,
    updateUserFavorite,
    updateBidHistory,
    updateBidList,
  } = useAuthStore();
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchPosts()
      .then((post) => {
        // 게시글 중복 카운트 방지용 쿠키
        const cookieName = `view_${isLogin ? userInfo?.id : "non"}`;
        const cookieContents = [
          ...new Set([...(cookies[cookieName] || []), POST_ID]),
        ];
        // 쿠키 만기
        // const expires = new Date();
        // expires.setHours(0, 0, 0, 0);
        // expires.setDate(expires.getDate() + 1);
        setCookie(cookieName, cookieContents, {
          path: "/",
          // expires,
        });

        if (!cookies[cookieName]?.includes(POST_ID)) {
          // 카운트하는 함수 생성 - 나 자신의 조회는 카운트X
          if (post.user_id !== userInfo?.uuid) {
            updatePostCnt(post.cnt);
            post.cnt += 1;
          }
        }

        setDetail([post]);
        setFavoriteCnt(post.favorite_list.length);
        setFavoriteCheck(
          post.favorite_list.some((item) => item.uuid === userInfo.uuid)
        );
        return post.user_id;
      })
      .then((id) => {
        getSellList(id);
        setLoading(false);
      });
    setLoading(false);
  }, [pathname]);

  const fetchPosts = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?id=${POST_ID}`
    );
    // setDetail(data);
    setUserCheck(data[0].user_id === userInfo?.uuid);

    setBidHistoryDetail(data[0]?.bid_history || []);
    // if (data[0]?.bid_history?.length) {
    //   const maxAmount = data[0].bid_history.reduce((max, current) =>
    //     current.amount > max.amount ? current : max
    //   );
    //   setBidAmount(maxAmount?.amount);
    // } else setBidAmount(data[0]?.start_price || 0);
    setBidAmount(data[0]?.now_price || data[0]?.start_price || 0);

    return data[0];
  };
  const updatePostCnt = async (cnt: number) => {
    try {
      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        cnt: cnt + 1,
      });
    } catch (error) {
      console.log(error);
      console.log("조회수 갱신에 실패했습니다");
    }
  };

  const getSellList = async (id: string) => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?id_ne=${POST_ID}&user_id=${id}&_limit=4&_sort=-created_at`
    );

    setSellList(data.filter((item) => item.id !== POST_ID));
  };

  const openComponent = () => setShow(true);

  const editPost = (isOpen: boolean) => {
    if (!isOpen) {
      alert("입찰 완료된 게시글은 수정할 수 없습니다!");
      return false;
    }
    navigate(`/sell/${POST_ID}`);
  };

  const deletePost = async (isOpen: boolean) => {
    if (!isOpen) {
      alert("입찰 완료된 게시글은 삭제할 수 없습니다!");
      return false;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/posts/${POST_ID}`);
      alert("게시글 삭제가 완료되었습니다!");
      setLoading(false);
      navigate("/auction");
    } catch (error) {
      console.error(error);
      alert("게시글 삭제에 실패했습니다!");
    }
  };

  const updateFavorite = async (item: any) => {
    const cnt = favoriteCheck ? favoriteCnt - 1 : favoriteCnt + 1;
    let favorite_list;
    if (favoriteCheck) {
      favorite_list = item.favorite_list.filter(
        (item) => item.uuid !== userInfo.uuid
      );
    } else {
      favorite_list = [
        ...item.favorite_list,
        {
          id: userInfo.id,
          uuid: userInfo.uuid,
        },
      ];
    }
    favorite_list = Array.from(
      new Map(favorite_list.map((item) => [item.id, item])).values()
    );

    setLoading(true);
    try {
      if (!favoriteCheck) {
        const favoriteList = [
          {
            id: item.id,
            category_id: item.category_id,
            src: item.src,
            start_price: item.start_price,
            title: item.title,
          },
          ...favorite,
        ];
        await axios.patch(`http://localhost:4000/user/${userInfo.id}`, {
          favorite,
        });
        updateUserFavorite(favoriteList);
      } else {
        const favoriteList = favorite.filter((item) => item.id !== POST_ID);
        await axios.patch(`http://localhost:4000/user/${userInfo.id}`, {
          favorite,
        });
        updateUserFavorite(favoriteList);
      }

      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        favorite: cnt,
        favorite_list,
      });
      alert("성공");
      setFavoriteCnt(cnt);
      setFavoriteCheck(!favoriteCheck);
    } catch (error) {
      console.log(error);
      console.log("실패했습니다");
    }
    setLoading(false);
  };

  const auctionBidding = async (item: any) => {
    if (bidAmount <= detail[0].now_price) {
      alert("입찰가는 현대최대가 보다 높은 값만 입력할 수 있습니다!");
      return false;
    }

    setLoading(true);
    try {
      const bid_history = [
        {
          id: POST_ID,
          amount: bidAmount,
          bidder: userInfo?.nickname || "USER",
          time: setDateTemp(),
          user_id: userInfo?.id,
          uuid: userInfo?.uuid,
        },
        ...bidHistory,
      ];
      let bid_list = [
        {
          id: item.id,
          category_id: item.category_id,
          src: item.src,
          start_price: item.start_price,
          title: item.title,
        },
        ...bidList,
      ];
      bid_list = Array.from(
        new Map(bid_list.map((item) => [item.id, item])).values()
      );
      await axios.patch(`http://localhost:4000/user/${userInfo.id}`, {
        bid_history,
        bid_list,
      });
      updateBidHistory(bid_history);
      updateBidList(bid_list);

      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        now_price: bidAmount,
        bid_count: bidHistoryDetail.length + 1,
        bid_history: [
          {
            id: POST_ID,
            amount: bidAmount,
            bidder: userInfo?.nickname || "USER",
            time: setDateTemp(),
            user_id: userInfo?.id,
            uuid: userInfo?.uuid,
          },
          ...bidHistoryDetail,
        ],
      });
      alert("입찰 완료!");
      setOpenBidding(false);
    } catch (error) {
      console.log(error);
      alert("입찰에 실패했습니다!");
    }
    try {
      await fetchPosts();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const closeAuction = async (
    isOpen: boolean,
    endDate: string,
    history: any,
    title: string,
    src: string,
    category_id: number
  ) => {
    // 입찰 마감 처리는 최소 14일 이후에 가능+
    if (!isOpen) return false;

    if (new Date() < new Date(endDate)) {
      alert("최소 마감일 이후에 마감할 수 있습니다.");
      return false;
    }

    const last_bidder = [];
    if (history.length) {
      const bidder = history.reduce(
        (acc, curr) => (curr.amount > acc.amount ? curr : acc),
        history[0]
      );
      last_bidder.push(bidder);
    }

    try {
      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        is_open: 0,
        end_date: setDateTemp(),
        last_bidder,
      });
      if (last_bidder.length) {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:4000/user/${last_bidder[0].user_id}`
        );
        const award = data?.bid_award;

        let bid_award = [
          {
            award_date: setDateTemp(),
            amount: last_bidder[0].amount,
            id: last_bidder[0].id,
            time: last_bidder[0].time,
            title,
            src,
            category_id,
          },
        ];
        if (award) {
          bid_award = [...bid_award, ...award];
        }
        await axios.patch(
          `http://localhost:4000/user/${last_bidder[0].user_id}`,
          {
            bid_award,
          }
        );
      }
      alert("마감 처리되었습니다!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("실패했습니다!");
      setLoading(false);
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
              {userCheck ? (
                <div className="user_utils">
                  <button
                    onClick={() => editPost(item.is_open)}
                    disabled={!item.is_open}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deletePost(item.is_open)}
                    disabled={loading || !item.is_open}
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div className="user_utils">
                  {isLogin && (
                    <button
                      onClick={() => updateFavorite(item)}
                      disabled={loading}
                    >
                      {favoriteCheck ? "★" : "☆"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <hr />
            {/* <p>{findCategory(item?.category_id)}</p> */}
            <CommonCategoryBadge categoryID={item?.category_id} />
            <CommonTitle
              type={1}
              title={item.title}
              isOpen={Boolean(item?.is_open)}
            />
            <CommonPaddingBox>
              <p>{item.start_date}</p>
              <p>조회수 | {item?.cnt}</p>
              <p>관심 | {favoriteCnt}</p>
            </CommonPaddingBox>
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
              <CommonTitle type={3} title="품목 세부 정보" />
              {/* <p>카테고리/시작가격/시작날짜/종료날짜</p> */}
              <CommonPaddingBox>
                <p>
                  카테고리 | {findCategory(item?.category_id)} <br />
                  시작가 | {item?.start_price}원 <br />
                  입찰횟수 | {item?.bid_count} <br />
                  현재최대가 | {item?.now_price} <br />
                  마감일 | {item?.end_date}
                </p>
              </CommonPaddingBox>
            </section>
            {userCheck && (
              <CommonPaddingBox>
                <p>*가장 높은 금액을 입력한 유저에게 자동으로 낙찰됩니다!</p>
                <button
                  onClick={() =>
                    closeAuction(
                      item?.is_open,
                      item?.end_date,
                      item.bid_history,
                      item?.title,
                      item?.src,
                      item?.category_id
                    )
                  }
                  disabled={!item?.is_open}
                >
                  입찰 마감 처리
                </button>
              </CommonPaddingBox>
            )}
            {!userCheck && (
              <>
                <button onClick={() => setOpenBidding(!openBidding)}>
                  {openBidding ? <>닫기</> : <>입찰하기</>}
                </button>
              </>
            )}
            {openBidding && (
              <section>
                <CommonPaddingBox>
                  가격을 입력해주세요! <br />* 한 번 입찰하면 취소할 수
                  없습니다!
                  <br />
                  <input
                    type="number"
                    min={item?.start_price}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                  <button
                    onClick={() => auctionBidding(item)}
                    disabled={loading}
                  >
                    입찰하기
                  </button>
                </CommonPaddingBox>
              </section>
            )}
            <section>
              <CommonTitle type={4} title="상세내용" />
              <CommonPaddingBox>
                <p>{item.contents}</p>
              </CommonPaddingBox>
            </section>
            {!item.is_open && (
              <section>
                <CommonTitle type={3} title="최종 입찰자" />
                <CommonPaddingBox>
                  <button>
                    {item.last_bidder?.[0]?.bidder || "입찰자가 없습니다."}
                  </button>
                </CommonPaddingBox>
              </section>
            )}
            <section>
              <CommonTitle type={3} title="입찰내역" />
              <CommonPaddingBox>
                {bidHistoryDetail.length ? (
                  <ShowListTable
                    tableGrid={[1, 1, 2]}
                    tableHeader={["bidder", "amount", "time"]}
                    tableList={bidHistoryDetail}
                  />
                ) : (
                  <div>입찰자가 없습니다</div>
                )}
              </CommonPaddingBox>
            </section>
          </section>
        );
      })}
      {/* 다른내용 */}
      <section>
        <div>
          <CommonTitle
            type={2}
            title="판매자의 다른 판매 물품"
            link="/mypage/list"
            linkProps={{
              state: {
                uuid: sellList[0]?.user_id,
                nickname: sellList[0]?.user_info,
              },
            }}
          />
        </div>
        <AuctionListLayout grid={4}>
          {sellList?.map((item) => (
            <Link to={`/auction/${item.id}`} key={`item_${item.id}`}>
              <ListPerItem
                key={`item_${item.id}`}
                src={item.src}
                category={findCategory(item?.category_id)}
                title={item.title}
                startPrice={item.start_price}
              />
            </Link>
          ))}
        </AuctionListLayout>
      </section>
    </ItemDetailLayout>
  );
}
