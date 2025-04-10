import api from "../../apis/api";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import ShowListTable from "../../components/UI/ShowListTable";
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
import { postBidHistory, postType } from "../../types/post";
import {
  deletePost,
  getDetailPost,
  getOtherPosts,
  updateFavorite,
} from "../../apis/libs";
import { useQuery } from "react-query";
import CommonModal from "../../components/common/CommonModal";
import { queryClient } from "../../main";

export default function Detail() {
  const [loading, setLoading] = useState<boolean>(false);

  // const [detail, setDetail] = useState<postType | null>(null);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [favoriteCnt, setFavoriteCnt] = useState<number>(0);
  const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidHistoryDetail, setBidHistoryDetail] = useState<
    Array<postBidHistory> | []
  >([]);

  // 모달
  const [toggle, setToggle] = useState<boolean>(false);

  const { id: POST_ID } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  const {
    isLogin,
    userInfo,
    updateSalesHistory,
    updateBidList,
    updateBidAward,
  } = useAuthStore();
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  const cntUpdate = useMemo(() => {
    const cookieName = `view_${isLogin ? userInfo?.id : "non"}`;
    return !cookies[cookieName]?.includes(POST_ID);
  }, [pathname]);

  const getDetailPostWait = async (POST_ID: string, cntUpdate: boolean) => {
    try {
      const { data, err } = await getDetailPost(POST_ID, cntUpdate);
      if (err) {
        console.log(err);
        return {};
      }

      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const getOtherPostsWait = async (userID: string) => {
    try {
      const res = await getOtherPosts(userID);
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // const {data: detail, isLoading: detailLoading} = useQuery({
  const all = useQuery({
    queryKey: ["detail", POST_ID],
    queryFn: () => getDetailPostWait(POST_ID as string, cntUpdate),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    enabled: !!POST_ID,
  });

  const { data: otherList, isLoading: otherLoading } = useQuery({
    queryKey: ["other-list", all?.data?.user_id],
    queryFn: () => getOtherPostsWait(all?.data?.user_id as string),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    enabled: !!all?.data && JSON.stringify(all.data) !== "{}",
  });

  useEffect(() => {
    // 데이터 로딩 완료 후 게시글 조회수 관련 쿠키
    if (!all.isLoading && cntUpdate) {
      // 게시글 중복 카운트 방지용 쿠키
      const cookieName = `view_${isLogin ? userInfo?.id : "non"}`;
      const cookieContents = [
        ...new Set([...(cookies[cookieName] || []), POST_ID]),
      ];
      // 쿠키 만기
      const expires = new Date();
      expires.setHours(0, 0, 0, 0);
      expires.setDate(expires.getDate() + 1);
      setCookie(cookieName, cookieContents, {
        path: "/",
        expires,
      });
    }
  }, [all.isLoading]);

  useEffect(() => {
    setUserCheck(all.data?.user_id === userInfo?.uuid);
    setBidAmount(all.data?.now_price || all.data?.start_price || 0);
    setFavoriteCnt(all.data?.favorite);
    setFavoriteCheck(
      all.data?.favorite_list?.some((item: string) => item === userInfo?.uuid)
    );
    setBidHistoryDetail(all.data?.bid_history || []);
  }, [all.data]);

  const fetchPosts = async () => {
    const { data } = await api.get(`posts/${POST_ID}`);
    setUserCheck(data.user_id === userInfo?.uuid);
    setBidHistoryDetail(data?.bid_history || []);
    setBidAmount(data?.now_price || data?.start_price || 0);

    return data;
  };

  const openComponent = () => setShow(true);

  const editPost = (isOpen: boolean) => {
    if (!isOpen) {
      alert("입찰 완료된 게시글은 수정할 수 없습니다!");
      return false;
    }
    navigate(`/sell/${POST_ID}`);
  };

  /*const deletePostPrev = async (isOpen: boolean) => {
    if (!isOpen) {
      alert("입찰 완료된 게시글은 삭제할 수 없습니다!");
      return false;
    }

    try {
      setLoading(true);
      await api.delete(`posts/${POST_ID}`);
      updateSalesHistory(null);
      alert("게시글 삭제가 완료되었습니다!");
      setLoading(false);
      navigate("/auction", { replace: true });
    } catch (error) {
      console.error(error);
      alert("게시글 삭제에 실패했습니다!");
    }
  };*/

  // fb 게시글 삭제
  const deletePostWait = async (isOpen: boolean) => {
    if (!userCheck) {
      alert("게시글 작성자만 삭제할 수 있습니다!");
      return false;
    }

    if (!isOpen) {
      alert("입찰 완료된 게시글은 삭제할 수 없습니다!");
      return false;
    }

    try {
      setLoading(true);
      await deletePost(POST_ID as string);
      updateSalesHistory(null);
      alert("게시글 삭제가 완료되었습니다!");
      setLoading(false);
      navigate("/auction", { replace: true });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("게시글 삭제에 실패했습니다!");
    }
  };
  const openDeleteModal = (isOpen: boolean) => {
    if (!userCheck) {
      alert("게시글 작성자만 삭제할 수 있습니다!");
      return false;
    }

    if (!isOpen) {
      alert("입찰 완료된 게시글은 삭제할 수 없습니다!");
      return false;
    }

    setToggle(true);
  };

  // 게시글 좋아요
  const updateFavoriteWait = async (
    title: string,
    src: string,
    category_id: number,
    start_price: number
  ) => {
    if (!isLogin) {
      alert("로그인 후 이용할 수 있습니다!");
      return false;
    }

    setLoading(true);

    try {
      const addItem = {
        id: userInfo?.id + POST_ID!,
        item_id: POST_ID!,
        user_id: userInfo?.id as string,
        uuid: userInfo?.uuid as string,
        title,
        src,
        category_id,
        start_price,
      };
      const {
        success,
        res: [isFavorite, cnt],
      } = await updateFavorite(
        POST_ID!,
        userInfo?.uuid as string,
        favoriteCheck,
        addItem
      );

      if (success) {
        setFavoriteCheck(isFavorite);
        setFavoriteCnt(cnt);
        alert("ok");
        queryClient.invalidateQueries({ queryKey: ["home", "favorite"] });
      } else {
        alert("실패했습니다");
      }
    } catch (error) {
      console.log(error);
      alert("실패했습니다");
    }

    setLoading(false);
  };

  /*
  const updateFavoritePrev = async (item: postType) => {
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
        await api.delete(`favorite/${userInfo?.id + POST_ID!}`);
      } else {
        // 좋아요 등록
        await api.post(`favorite`, {
          id: userInfo?.id + POST_ID!,
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
      updateBidList(null);
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
        updateBidAward(null);
      }
      alert("처리되었습니다!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // tsx
  if (all.isLoading) {
    return (
      <ItemDetailLayout>
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
                <CircularProgress color="secondary" />
              </div>
            </div>
          </div>
        </section>
        <section>
          <CommonTitle type={2} title="판매자의 다른 판매 물품" />
          <CommonList grid={4} loading={true}></CommonList>
        </section>
      </ItemDetailLayout>
    );
  }
  return (
    <ItemDetailLayout>
      {JSON.stringify(all.data) === "{}" ? (
        <CommonNodataBox>해당 게시글이 존재하지 않습니다.</CommonNodataBox>
      ) : (
        <>
          {/* 제품 */}
          <section>
            <div className="item_img" onClick={openComponent}>
              <div className="img_wrap">
                <img src={all.data?.src} alt="image" />
              </div>
            </div>
            {show && <FullSizeImage src={all.data?.src} setShow={setShow} />}
            <div className="user_info">
              <div className="user_prof">
                <AccountCircleIcon />
                <h2>{all.data?.user_info}</h2>
              </div>
              <div className="user_utils">
                {userCheck ? (
                  <>
                    <div className="favorite">
                      <FavoriteTwoToneIcon color="secondary" />
                      <span>{numberFormat(favoriteCnt)}</span>
                    </div>
                    <button
                      onClick={() => editPost(Boolean(all.data?.is_open))}
                      disabled={!all.data?.is_open}
                    >
                      <EditIcon color="secondary" />
                    </button>
                    <button
                      onClick={() =>
                        openDeleteModal(Boolean(all.data?.is_open))
                      }
                      disabled={loading || !all.data?.is_open}
                    >
                      <DeleteIcon color="secondary" />
                    </button>
                  </>
                ) : (
                  <button
                    className="favorite"
                    onClick={() =>
                      updateFavoriteWait(
                        all.data?.title,
                        all.data?.src,
                        all.data?.category_id,
                        all.data?.start_price
                      )
                    }
                    disabled={loading}
                  >
                    {favoriteCheck ? (
                      <FavoriteTwoToneIcon color="secondary" />
                    ) : (
                      <FavoriteBorderIcon color="secondary" />
                    )}
                    <span>{numberFormat(favoriteCnt)}</span>
                  </button>
                )}
              </div>
            </div>
            <hr />
            <section>
              <div className="contents_info" style={{ paddingTop: "8px" }}>
                <CommonCategoryBadge categoryID={all.data?.category_id} />
              </div>
              <CommonTitle
                type={1}
                title={all.data?.title}
                isOpen={Boolean(all.data?.is_open)}
              />
              <div className="contents_info">
                <p>작성일 | {all.data?.start_date}</p>
                <p>조회 | {numberFormat(all.data?.cnt)}</p>
              </div>

              <div className="item_info">
                <div>
                  <p>현재 입찰가</p>
                  <p>{numberFormat(all.data?.now_price) || "no bid"}</p>
                </div>
                <div>
                  <p>총 입찰</p>
                  <p>{numberFormat(all.data?.bid_count) || 0}</p>
                </div>
                <div>
                  <p>종료일</p>
                  <p>{all.data?.end_date?.split(" ")[0]}</p>
                </div>
              </div>
            </section>

            <section>
              <CommonTitle type={3} title="품목 세부 정보" />
              <CommonPaddingBox>
                <ItemDetailBox>
                  <div className="detail_table">
                    <p>
                      <span>카테고리</span>
                      <span className="contents">
                        {findCategory(all.data?.category_id)}
                      </span>
                    </p>
                    <p>
                      <span>시작가</span>
                      <span className="contents">
                        {numberFormat(all.data?.start_price)}원
                      </span>
                    </p>
                    <p>
                      <span>입찰횟수</span>
                      <span className="contents">
                        {numberFormat(all.data?.bid_count)}
                      </span>
                    </p>
                    <p>
                      <span>현재최대가</span>
                      <span className="contents">
                        {numberFormat(all.data?.now_price)}
                      </span>
                    </p>
                    <p>
                      <span>마감일</span>
                      <span className="contents">{all.data?.end_date}</span>
                    </p>
                  </div>
                </ItemDetailBox>
              </CommonPaddingBox>
            </section>
            {userCheck && Boolean(all.data?.is_open) && (
              <CommonPaddingBox>
                <p className="notice">
                  *가장 높은 금액을 입력한 유저에게 자동으로 낙찰됩니다!
                </p>
                <CommonButton
                  text="입찰 마감 처리"
                  btnType="large"
                  onClick={() =>
                    closeAuction(
                      Boolean(all.data?.is_open),
                      all.data?.end_date,
                      all.data?.bid_history,
                      all.data?.title,
                      all.data?.src,
                      all.data?.category_id
                    )
                  }
                  disabled={!all.data?.is_open}
                />
              </CommonPaddingBox>
            )}
            {!userCheck && Boolean(all.data?.is_open) && (
              <section>
                <CommonTitle type={3} title="입찰하기" />
                <CommonPaddingBox>
                  <div className="bid_input">
                    <CommonInput
                      type="number"
                      length="full"
                      min={all.data?.start_price}
                      value={bidAmount}
                      setValue={(e) => setBidAmount(Number(e.target.value))}
                    />
                    <CommonButton
                      text="입찰하기"
                      btnType="large"
                      onClick={() =>
                        auctionBidding(all.data, all.data?.now_price)
                      }
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
                  <p className="textarea">{all.data?.contents}</p>
                </ItemDetailBox>
              </CommonPaddingBox>
            </section>
            {!all.data?.is_open && (
              <section>
                <CommonTitle type={3} title="최종 입찰자" />
                <CommonPaddingBox>
                  <ItemDetailBidderBox>
                    <MilitaryTechIcon className="icon" />
                    <div className="bidder_wrap">
                      <p>
                        {all.data?.last_bidder?.bidder || "입찰자가 없습니다."}
                      </p>
                      {all.data?.last_bidder?.bidder && (
                        <p className="price">
                          낙찰 금액은
                          <span>
                            {numberFormat(all.data?.last_bidder?.amount)}
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
                {all.data?.bid_history?.length ? (
                  <ShowListTable
                    tableGrid={[1, 1, 2]}
                    tableHeader={["bidder", "amount", "time"]}
                    tableHeaderText={["입찰자", "입찰가", "입찰 시간"]}
                    tableList={all.data?.bid_history}
                  />
                ) : (
                  <CommonNodataBox>입찰자가 없습니다</CommonNodataBox>
                )}
              </CommonPaddingBox>
            </section>
          </section>
          {/* 판매자의 다른 판매 물품 */}
          <section>
            <CommonTitle
              type={2}
              title="판매자의 다른 판매 물품"
              link="/mypage/list"
              linkProps={{
                state: {
                  uuid: all.data?.user_id,
                  nickname: all.data?.user_info,
                },
              }}
            />
            <CommonList grid={4} loading={all.isLoading || otherLoading}>
              {otherList?.map((sell, idx) => (
                <Link to={`/auction/${sell.id}`} key={`item_${sell.id}_${idx}`}>
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

          {/* 모달 */}
          <CommonModal
            isOpen={toggle}
            setDisplay={setToggle}
            showFooter={true}
            handleModalOk={() => deletePostWait(Boolean(all.data?.is_open))}
          >
            <p>게시글을 삭제하겠습니까?</p>
          </CommonModal>
        </>
      )}
    </ItemDetailLayout>
  );
}
