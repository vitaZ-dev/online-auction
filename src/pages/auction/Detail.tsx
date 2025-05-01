import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  auctionBidding,
  closeAuction,
  deletePost,
  getDetailBidHistory,
  getDetailPost,
  getOtherPosts,
  updateFavorite,
} from "../../apis/libs";
import { useQuery } from "@tanstack/react-query";
import CommonModal from "../../components/common/CommonModal";
import { DocumentData } from "firebase/firestore";
import queryClient from "../../libs/queryClient";

export default function Detail() {
  const [loading, setLoading] = useState<boolean>(false);

  // const [detail, setDetail] = useState<postType | null>(null);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [favoriteCnt, setFavoriteCnt] = useState<number>(0);
  const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidHistoryDetail, setBidHistoryDetail] = useState<
    Array<DocumentData> | [] | null
  >([]);
  const [bidHistoryLoad, setBidHistoryLoad] = useState<boolean>(false);
  const [bidHistoryShow, setBidHistoryShow] = useState<boolean>(false);

  // 모달
  const [toggle, setToggle] = useState<boolean>(false);

  const { id: POST_ID } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  const { isLogin, userInfo } = useAuthStore();
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  const isUnmounted = useRef(false);
  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

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
    // staleTime: 1 * 60 * 1000,
    // gcTime: 30 * 60 * 1000,
    enabled: !!POST_ID,
  });

  const { data: otherList, isLoading: otherLoading } = useQuery({
    queryKey: ["other-list", all?.data?.user_id],
    queryFn: () => getOtherPostsWait(all?.data?.user_id as string),
    // staleTime: 1 * 60 * 1000,
    // gcTime: 30 * 60 * 1000,
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
    // setBidHistoryDetail(all.data?.bid_history || []);
  }, [all.data, userInfo?.uuid]);

  const openComponent = () => setShow(true);

  const editPost = (isOpen: boolean) => {
    if (!isOpen) {
      alert("입찰 완료된 게시글은 수정할 수 없습니다!");
      return false;
    }
    navigate(`/sell/${POST_ID}`);
  };

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
      alert("게시글 삭제가 완료되었습니다!");
      setLoading(false);
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "mypage" && query.queryKey[1] === "recent",
      });
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
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "mypage" && query.queryKey[1] === "favorite",
        });
      } else {
        alert("실패했습니다");
      }
    } catch (error) {
      console.log(error);
      alert("실패했습니다");
    }

    setLoading(false);
  };

  // 게시글 입찰내역 보이기
  const getDetailBidHistoryWait = async () => {
    setBidHistoryShow(!bidHistoryShow);
    if (!bidHistoryLoad) {
      setLoading(true);
      const { data, err } = await getDetailBidHistory(POST_ID!, 10);

      if (err) {
        console.log(err);
        setLoading(false);
        return;
      } else {
        setBidHistoryDetail(data);
        setTimeout(() => {
          if (!isUnmounted.current) {
            setBidHistoryLoad(true);
            setLoading(false);
          }
        }, 1000);
        return;
      }
    }
  };

  // 입찰
  const auctionBiddingWait = async (item: any, nowPrice: number) => {
    if (!isLogin) {
      alert("로그인 후 이용할 수 있습니다!");
      return false;
    }

    if (bidAmount <= nowPrice) {
      alert("입찰가는 현대최대가 보다 높은 값만 입력할 수 있습니다!");
      return false;
    }

    setLoading(true);
    const bidItem = {
      item_id: POST_ID!,
      title: item.title,
      category_id: item.category_id,
      src: item.src,
      start_price: item.start_price,
    };
    const historyItem = {
      item_id: POST_ID!,
      uuid: userInfo?.uuid as string,
      amount: bidAmount,
      bidder: userInfo?.nickname || "USER",
      time: setDateTemp(),
    };

    try {
      const { err } = await auctionBidding(
        POST_ID!,
        historyItem,
        bidItem,
        bidAmount,
        userInfo?.uuid as string
      );
      if (err) {
        console.log(err);
      } else {
        queryClient.invalidateQueries({ queryKey: ["detail", POST_ID] });
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "mypage" && query.queryKey[1] === "bid_list",
        });
        alert("입찰이 완료되었습니다!");
        setBidHistoryLoad(false);
        setBidHistoryShow(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("입찰에 실패했습니다.");
      setLoading(false);
    }
  };

  // 게시글 입찰 마감 처리
  const closeAuctionWait = async (isOpen: boolean, endDate: string) => {
    // 입찰 마감 처리는 최소 14일 이후에 가능+
    if (!isOpen) return false;

    if (new Date() < new Date(endDate)) {
      alert("최소 마감일 이후에 마감할 수 있습니다.");
      return false;
    }
    const awardCheck: boolean = all.data?.bid_count > 0;

    try {
      setLoading(true);
      const { err } = await closeAuction(POST_ID!, awardCheck);
      if (err) {
        console.log(err);
        alert("오류가 발생했습니다!");
        setLoading(false);
        return;
      }

      // 리액트쿼리 처리
      queryClient.invalidateQueries({ predicate: () => true });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "mypage" && query.queryKey[1] === "recent",
      });
      queryClient.refetchQueries({ queryKey: ["detail", POST_ID] });
      alert("처리되었습니다!");
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      alert("낙찰 처리에 실패했습니다!");
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
                        {numberFormat(all.data?.now_price)}원
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
                    closeAuctionWait(
                      Boolean(all.data?.is_open),
                      all.data?.end_date
                    )
                  }
                  disabled={!all.data?.is_open || loading}
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
                        auctionBiddingWait(all.data, all.data?.now_price)
                      }
                      disabled={loading}
                    />
                  </div>
                  <p className="notice">* 한 번 입찰하면 취소할 수 없습니다!</p>
                </CommonPaddingBox>
              </section>
            )}

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
              <CommonPaddingBox>
                <CommonButton
                  text={bidHistoryShow ? "입찰 기록 숨기기" : "입찰 기록 보기"}
                  btnType="large"
                  onClick={() => getDetailBidHistoryWait()}
                />
                <p className="notice">* 최근 10개 입찰 기록만 보여집니다.</p>
              </CommonPaddingBox>
              {bidHistoryShow && (
                <>
                  <CommonTitle type={3} title="입찰내역" />
                  {!bidHistoryLoad && loading ? (
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
                  ) : (
                    <CommonPaddingBox>
                      {all.data?.bid_count ? (
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
                  )}
                </>
              )}
            </section>
          </section>

          <section>
            <CommonTitle type={4} title="상세내용" />
            <CommonPaddingBox>
              <ItemDetailBox>
                <p className="textarea">{all.data?.contents}</p>
              </ItemDetailBox>
            </CommonPaddingBox>
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
