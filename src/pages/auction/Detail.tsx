import api from "../../apis/api";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ItemDetailBidderBox,
  ItemDetailBox,
  ItemDetailLayout,
} from "../../styles/AuctionStyle";
import { findCategory } from "../../modules/category";
import useAuthStore from "../../stores/useAuthStore";
import FullSizeImage from "../../components/common/FullSizeImage";
import { useCookies } from "react-cookie";
import { setDateTemp } from "../../modules";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { CommonNodataBox, CommonPaddingBox } from "../../styles/CommonStyle";
import ShowListTable from "../../components/ShowListTable";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonCategoryBadge from "../../components/UI/CommonCategoryBadge";
import { numberFormat } from "../../utils";
import { CircularProgress } from "@mui/material";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import CommonInput from "../../components/common/CommonInput";
import CommonButton from "../../components/common/CommonButton";
import { postBidHistory, postFavoriteList, postType } from "../../types/post";

export default function Detail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [sellListLoading, setSellListLoading] = useState<boolean>(true);

  const [detail, setDetail] = useState<postType | null>(null);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [favoriteCnt, setFavoriteCnt] = useState<number>(0);
  const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidHistoryDetail, setBidHistoryDetail] = useState<
    Array<postBidHistory> | []
  >([]);

  const [sellList, setSellList] = useState<Array<postType> | []>([]);

  const { pathname } = useLocation();
  const POST_ID = pathname.split("/")[2];
  const { isLogin, userInfo } = useAuthStore();
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

        setDetail(post);
        setFavoriteCnt(post.favorite_list.length);
        setFavoriteCheck(
          post.favorite_list.some(
            (item: postFavoriteList) => item.uuid === userInfo?.uuid
          )
        );
        setPageLoading(false);
        return post.user_id;
      })
      .then((id) => {
        getSellList(id);
        setLoading(false);
      });
    setLoading(false);
  }, [pathname]);

  const fetchPosts = async () => {
    const { data } = await api.get(`posts/${POST_ID}`);
    // setDetail(data);
    setUserCheck(data.user_id === userInfo?.uuid);

    setBidHistoryDetail(data?.bid_history || []);
    // if (data[0]?.bid_history?.length) {
    //   const maxAmount = data[0].bid_history.reduce((max, current) =>
    //     current.amount > max.amount ? current : max
    //   );
    //   setBidAmount(maxAmount?.amount);
    // } else setBidAmount(data[0]?.start_price || 0);
    setBidAmount(data?.now_price || data?.start_price || 0);

    return data;
  };
  const updatePostCnt = async (cnt: number) => {
    try {
      await api.patch(`posts/${POST_ID}`, {
        cnt: cnt + 1,
      });
    } catch (error) {
      console.log(error);
      console.log("조회수 갱신에 실패했습니다");
    }
  };

  const getSellList = async (id: string) => {
    const { data } = await api.get(
      `posts?id_ne=${POST_ID}&user_id=${id}&_limit=4&_sort=-created_at`
    );

    setSellList(data.filter((item: postType) => item.id !== POST_ID));
    setSellListLoading(false);
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
      await api.delete(`posts/${POST_ID}`);
      alert("게시글 삭제가 완료되었습니다!");
      setLoading(false);
      navigate("/auction");
    } catch (error) {
      console.error(error);
      alert("게시글 삭제에 실패했습니다!");
    }
  };

  /*
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
*/

  const updateFavorite = async (item: postType) => {
    if (!isLogin) {
      alert("로그인 후 이용할 수 있습니다!");
      return false;
    }

    const cnt = favoriteCheck ? favoriteCnt - 1 : favoriteCnt + 1;
    let favorite_list;
    if (favoriteCheck) {
      favorite_list = item.favorite_list.filter(
        (item) => item.uuid !== userInfo?.uuid
      );
    } else {
      favorite_list = [
        ...item.favorite_list,
        {
          id: userInfo?.id,
          uuid: userInfo?.uuid,
        },
      ];
    }
    favorite_list = Array.from(
      new Map(favorite_list.map((item) => [item.id, item])).values()
    );

    setLoading(true);
    try {
      if (favoriteCheck) {
        // 좋아요 해제
        await api.delete(`favorite/${userInfo?.id + POST_ID}`);
      } else {
        // 좋아요 등록
        await api.post(`favorite`, {
          id: userInfo?.id + POST_ID,
          item_id: POST_ID,
          user_id: userInfo?.id,
          uuid: userInfo?.uuid,
          title: item.title,
          src: item.src,
          category_id: item.category_id,
          start_price: item.start_price,
        });
      }

      // 해당 제품 db 내용 업데이트
      await api.patch(`posts/${POST_ID}`, {
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

  /*
  const auctionBiddingPrev = async (item: any) => {
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
      await axios.patch(`http://localhost:4000/user/${userInfo?.id}`, {
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };
  */

  const auctionBidding = async (item: postType, nowPrice: number) => {
    if (!isLogin) {
      alert("로그인 후 이용할 수 있습니다!");
      return false;
    }

    if (bidAmount <= nowPrice) {
      alert("입찰가는 현대최대가 보다 높은 값만 입력할 수 있습니다!");
      return false;
    }

    const patch = bidHistoryDetail?.some((i) => i.uuid === userInfo?.uuid);

    setLoading(true);
    const nowTime = setDateTemp();
    try {
      if (patch) {
        // patch
        const filterHistory = bidHistoryDetail
          ? bidHistoryDetail.filter((i) => i.uuid === userInfo?.uuid)
          : [];

        await api.patch(`bid_list/${userInfo?.id + POST_ID}`, {
          history: [
            {
              item_id: POST_ID,
              user_id: userInfo?.id,
              uuid: userInfo?.uuid,
              amount: bidAmount,
              bidder: userInfo?.nickname || "USER",
              time: nowTime,
            },
            ...filterHistory,
          ],
        });
      } else {
        // post
        await api.post(`bid_list`, {
          id: userInfo?.id + POST_ID,
          item_id: POST_ID,
          user_id: userInfo?.id,
          uuid: userInfo?.uuid,
          bidder: userInfo?.nickname || "USER",
          amount: bidAmount,
          time: nowTime,
          title: item.title,
          src: item.src,
          category_id: item.category_id,
          start_price: item.start_price,
          history: [
            {
              item_id: POST_ID,
              user_id: userInfo?.id,
              uuid: userInfo?.uuid,
              amount: bidAmount,
              bidder: userInfo?.nickname || "USER",
              time: nowTime,
            },
          ],
        });
      }

      await api.patch(`posts/${POST_ID}`, {
        now_price: bidAmount,
        bid_count: bidHistoryDetail.length + 1,
        bid_history: [
          {
            id: POST_ID,
            user_id: userInfo?.id,
            uuid: userInfo?.uuid,
            amount: bidAmount,
            bidder: userInfo?.nickname || "USER",
            time: nowTime,
          },
          ...bidHistoryDetail,
        ],
      });
      alert("입찰 완료!");
    } catch (error) {
      console.log(error);
      alert("입찰에 실패했습니다!");
    }

    try {
      await fetchPosts();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };

  /*
  const closeAuctionPrev = async (
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
    if (history?.length) {
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
        updateBidAward(bid_award);
      }
      alert("마감 처리되었습니다!");
    } catch (error) {
      console.log(error);
      alert("실패했습니다!");
      setLoading(false);
    }

    try {
      const post = await axios.get(`http://localhost:4000/posts?id=${POST_ID}`);
      setDetail(post?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  */

  const closeAuction = async (
    isOpen: boolean,
    endDate: string,
    history: Array<postBidHistory>,
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

    let last_bidder = null;
    if (history.length) {
      last_bidder = history.reduce(
        (acc, curr) => (curr.amount > acc.amount ? curr : acc),
        history[0]
      );
    }

    const nowDate = setDateTemp();
    try {
      setLoading(true);
      await api.patch(`posts/${POST_ID}`, {
        is_open: 0,
        end_date: nowDate,
        last_bidder,
      });
      if (last_bidder) {
        await api.post(`bid_award`, {
          id: last_bidder.id + POST_ID,
          item_id: POST_ID,
          user_id: last_bidder.id,
          uuid: last_bidder.uuid,
          award_date: nowDate,
          time: last_bidder.time,
          amount: last_bidder.amount,
          title,
          category_id,
          src,
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // data 갱신
    try {
      const post = await api.get(` posts/${POST_ID}`);
      setDetail(post?.data[0]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ItemDetailLayout>
      {/* 제품 */}
      {pageLoading ? (
        <section>
          <div className="item_img">
            <div className="img_wrap">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress sx={{}} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        detail && (
          <section>
            <div className="item_img" onClick={openComponent}>
              <div className="img_wrap">
                <img src={detail.src} alt="image" />
              </div>
            </div>
            {show && <FullSizeImage src={detail.src} setShow={setShow} />}
            {pageLoading || (
              <div className="user_info">
                <div className="user_prof">
                  <AccountCircleIcon />
                  <h2>{detail.user_info}</h2>
                </div>
                {userCheck ? (
                  <div className="user_utils">
                    <div className="favorite">
                      <FavoriteTwoToneIcon color="secondary" />
                      <span>{numberFormat(favoriteCnt)}</span>
                    </div>
                    <button
                      onClick={() => editPost(Boolean(detail.is_open))}
                      disabled={!detail.is_open}
                    >
                      <EditIcon color="secondary" />
                    </button>
                    <button
                      onClick={() => deletePost(Boolean(detail.is_open))}
                      disabled={loading || !detail.is_open}
                    >
                      <DeleteIcon color="secondary" />
                    </button>
                  </div>
                ) : (
                  <div className="user_utils">
                    <button
                      className="favorite"
                      onClick={() => updateFavorite(detail)}
                      disabled={loading}
                    >
                      {favoriteCheck ? (
                        <FavoriteTwoToneIcon color="secondary" />
                      ) : (
                        <FavoriteBorderIcon color="secondary" />
                      )}
                      <span>{numberFormat(favoriteCnt)}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            <hr />
            <section>
              <div className="contents_info" style={{ paddingTop: "8px" }}>
                <CommonCategoryBadge categoryID={detail.category_id} />
              </div>
              <CommonTitle
                type={1}
                title={detail.title}
                isOpen={Boolean(detail.is_open)}
              />
              <div className="contents_info">
                <p>작성일 | {detail.start_date}</p>
                <p>조회 | {numberFormat(detail?.cnt)}</p>
              </div>
            </section>
            <div className="item_info">
              <div>
                <p>현재 입찰가</p>
                <p>{numberFormat(detail?.now_price) || "no bid"}</p>
              </div>
              <div>
                <p>총 입찰</p>
                <p>{numberFormat(detail?.bid_count) || 0}</p>
              </div>
              <div>
                <p>종료일</p>
                <p>{detail.end_date.split(" ")[0]}</p>
              </div>
            </div>

            <section>
              <CommonTitle type={3} title="품목 세부 정보" />
              <CommonPaddingBox>
                <ItemDetailBox>
                  <div className="detail_table">
                    <p>
                      <span>카테고리</span>
                      <span className="contents">
                        {findCategory(detail.category_id)}
                      </span>
                    </p>
                    <p>
                      <span>시작가</span>
                      <span className="contents">
                        {numberFormat(detail?.start_price)}원
                      </span>
                    </p>
                    <p>
                      <span>입찰횟수</span>
                      <span className="contents">
                        {numberFormat(detail?.bid_count)}
                      </span>
                    </p>
                    <p>
                      <span>현재최대가</span>
                      <span className="contents">
                        {numberFormat(detail?.now_price)}
                      </span>
                    </p>
                    <p>
                      <span>마감일</span>
                      <span className="contents">{detail.end_date}</span>
                    </p>
                  </div>
                </ItemDetailBox>
              </CommonPaddingBox>
            </section>
            {userCheck && Boolean(detail.is_open) && (
              <CommonPaddingBox>
                <p className="notice">
                  *가장 높은 금액을 입력한 유저에게 자동으로 낙찰됩니다!
                </p>
                <button
                  onClick={() =>
                    closeAuction(
                      Boolean(detail?.is_open),
                      detail?.end_date,
                      detail?.bid_history,
                      detail?.title,
                      detail?.src,
                      detail?.category_id
                    )
                  }
                  disabled={!detail.is_open}
                >
                  입찰 마감 처리
                </button>
              </CommonPaddingBox>
            )}
            {!userCheck && Boolean(detail.is_open) && (
              <section>
                <CommonTitle type={3} title="입찰하기" />
                <CommonPaddingBox>
                  <div className="bid_input">
                    <CommonInput
                      type="number"
                      length="full"
                      min={detail.start_price}
                      value={bidAmount}
                      setValue={(e) => setBidAmount(Number(e.target.value))}
                    />
                    <CommonButton
                      text="입찰하기"
                      btnType="large"
                      onClick={() => auctionBidding(detail, detail.now_price)}
                      disabled={loading}
                    />
                  </div>
                  <p className="notice">* 한 번 입찰하면 취소할 수 없습니다!</p>
                </CommonPaddingBox>
              </section>
            )}

            <section>
              <CommonTitle type={4} title="상세내용" />
              <CommonPaddingBox>
                <ItemDetailBox>
                  <p>{detail?.contents}</p>
                </ItemDetailBox>
              </CommonPaddingBox>
            </section>
            {!detail?.is_open && (
              <section>
                <CommonTitle type={3} title="최종 입찰자" />
                <CommonPaddingBox>
                  <ItemDetailBidderBox>
                    <MilitaryTechIcon className="icon" />
                    <div className="bidder_wrap">
                      <p>
                        {detail?.last_bidder?.bidder || "입찰자가 없습니다."}
                      </p>
                      {detail?.last_bidder?.bidder && (
                        <p className="price">
                          낙찰 금액은
                          <span>
                            {numberFormat(detail?.last_bidder?.amount)}
                          </span>
                          원 입니다.
                        </p>
                      )}
                    </div>
                  </ItemDetailBidderBox>
                </CommonPaddingBox>
              </section>
            )}
            <section>
              <CommonTitle type={3} title="입찰내역" />
              <CommonPaddingBox>
                {bidHistoryDetail?.length ? (
                  <ShowListTable
                    tableGrid={[1, 1, 2]}
                    tableHeader={["bidder", "amount", "time"]}
                    tableHeaderText={["입찰자", "입찰가", "입찰 시간"]}
                    tableList={bidHistoryDetail}
                  />
                ) : (
                  <CommonNodataBox>입찰자가 없습니다</CommonNodataBox>
                )}
              </CommonPaddingBox>
            </section>
          </section>
        )
      )}
      {/* 다른내용 */}
      <section>
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
        <CommonList grid={4} loading={sellListLoading}>
          {sellList?.map((sell) => (
            <Link to={`/auction/${sell.id}`} key={`item_${sell.id}`}>
              <CommonListItem
                key={`item_${sell.id}`}
                src={sell.src}
                category={findCategory(sell?.category_id)}
                title={sell.title}
                startPrice={sell.start_price}
                isOpen={Boolean(sell.is_open)}
              />
            </Link>
          ))}
        </CommonList>
      </section>
    </ItemDetailLayout>
  );
}

// {detail?.map((detail) => {
//   return (
//     <section key={detail.id}>
//       <div className="item_img" onClick={openComponent}>
//         <div className="img_wrap">
//           <img src={detail.src} alt="image" />
//         </div>
//       </div>
//       {show && <FullSizeImage src={detail?.src} setShow={setShow} />}
//       <div className="user_info">
//         <h2>{detail.user_info}</h2>
//         {userCheck ? (
//           <div className="user_utils">
//             <button
//               onClick={() => editPost(detail.is_open)}
//               disabled={!detail.is_open}
//             >
//               수정
//             </button>
//             <button
//               onClick={() => deletePost(detail.is_open)}
//               disabled={loading || !detail.is_open}
//             >
//               삭제
//             </button>
//           </div>
//         ) : (
//           <div className="user_utils">
//             {isLogin && (
//               <button
//                 onClick={() => updateFavorite(detail)}
//                 disabled={loading}
//               >
//                 {favoriteCheck ? "★" : "☆"}
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//       <hr />
//       {/* <p>{findCategory(detail?.category_id)}</p> */}
//       <CommonCategoryBadge categoryID={detail?.category_id} />
//       <CommonTitle
//         type={1}
//         title={detail.title}
//         isOpen={Boolean(detail?.is_open)}
//       />
//       <CommonPaddingBox>
//         <p>{detail.start_date}</p>
//         <p>조회수 | {numberFormat(detail?.cnt)}</p>
//         <p>관심 | {numberFormat(favoriteCnt)}</p>
//       </CommonPaddingBox>
//       {/* <div className="item_info">
//         <div>
//           <p>현재 입찰가</p>
//           <p>{detail.now_price || "no bid"}</p>
//         </div>
//         <div>
//           <p>총 입찰</p>
//           <p>{detail.bid}</p>
//         </div>
//         <div>
//           <p>종료일</p>
//           <p>{detail.end_date}</p>
//         </div>
//       </div> */}

//       <section>
//         <CommonTitle type={3} title="품목 세부 정보" />
//         {/* <p>카테고리/시작가격/시작날짜/종료날짜</p> */}
//         <CommonPaddingBox>
//           <p>
//             카테고리 | {findCategory(detail?.category_id)} <br />
//             시작가 | {numberFormat(detail?.start_price)}원 <br />
//             입찰횟수 | {numberFormat(detail?.bid_count)} <br />
//             현재최대가 | {numberFormat(detail?.now_price)} <br />
//             마감일 | {detail?.end_date}
//           </p>
//         </CommonPaddingBox>
//       </section>
//       {userCheck && (
//         <CommonPaddingBox>
//           <p>*가장 높은 금액을 입력한 유저에게 자동으로 낙찰됩니다!</p>
//           <button
//             onClick={() =>
//               closeAuction(
//                 detail?.is_open,
//                 detail?.end_date,
//                 detail.bid_history,
//                 detail?.title,
//                 detail?.src,
//                 detail?.category_id
//               )
//             }
//             disabled={!detail?.is_open}
//           >
//             입찰 마감 처리
//           </button>
//         </CommonPaddingBox>
//       )}
//       {!userCheck && Boolean(detail.is_open) && (
//         <>
//           <button onClick={() => setOpenBidding(!openBidding)}>
//             {openBidding ? <>닫기</> : <>입찰하기</>}
//           </button>
//         </>
//       )}
//       {openBidding && (
//         <section>
//           <CommonPaddingBox>
//             가격을 입력해주세요! <br />* 한 번 입찰하면 취소할 수
//             없습니다!
//             <br />
//             <input
//               type="number"
//               min={detail?.start_price}
//               value={bidAmount}
//               onChange={(e) => setBidAmount(Number(e.target.value))}
//             />
//             <button
//               onClick={() => auctionBidding(detail)}
//               disabled={loading}
//             >
//               입찰하기
//             </button>
//           </CommonPaddingBox>
//         </section>
//       )}
//       <section>
//         <CommonTitle type={4} title="상세내용" />
//         <CommonPaddingBox>
//           <p>{detail.contents}</p>
//         </CommonPaddingBox>
//       </section>
//       {!detail.is_open && (
//         <section>
//           <CommonTitle type={3} title="최종 입찰자" />
//           <CommonPaddingBox>
//             <button>
//               {detail?.last_bidder?.bidder || "입찰자가 없습니다."}
//             </button>
//           </CommonPaddingBox>
//         </section>
//       )}
//       <section>
//         <CommonTitle type={3} title="입찰내역" />
//         <CommonPaddingBox>
//           {bidHistoryDetail.length ? (
//             <ShowListTable
//               tableGrid={[1, 1, 2]}
//               tableHeader={["bidder", "amount", "time"]}
//               tableList={bidHistoryDetail}
//             />
//           ) : (
//             <div>입찰자가 없습니다</div>
//           )}
//         </CommonPaddingBox>
//       </section>
//     </section>
//   );
// })}
