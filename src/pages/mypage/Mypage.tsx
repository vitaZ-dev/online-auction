/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import defaultImg from "/images/profile_default.png";
import api from "../../apis/api";
import { Link } from "react-router-dom";
import { findCategory } from "../../modules/category";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { CommonNodataBox } from "../../styles/CommonStyle";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonButton from "../../components/common/CommonButton";
import { FavoriteType } from "../../types/user";

export default function Mypage() {
  const [userFavorite, setUserFavorite] = useState<Array<FavoriteType> | []>(
    []
  );
  const {
    userInfo,
    salesHistory,
    updateSalesHistory,
    bidList,
    updateBidList,
    bidAward,
    updateBidAward,
    logout,
  } = useAuthStore();

  useEffect(() => {
    // 판매 내역
    if (!salesHistory) getSalesHistory();

    // 입찰 내역
    if (!bidList) getBidList();

    // 낙찰 내역
    if (!bidAward) getBidAward();

    // 좋아요 리스트
    getFavorite();
    /*
    // 낙찰 내역
    const awardFilter = bidAward?.reduce((acc: any[], item: any) => {
      if (acc.length < 4) acc.push(item);
      return acc;
    }, []);
    setUserBidAward(awardFilter);

    // 좋아요 리스트
    const favoriteFilter = favorite?.reduce((acc: any[], item: any) => {
      if (acc.length < 4) acc.push(item);
      return acc;
    }, []);
    setUserFavorite(favoriteFilter);

    fetchPosts();
    */
  }, []);

  const getSalesHistory = async () => {
    const { data } = await api.get(
      `posts?user_id=${userInfo?.uuid}&_sort=-created_at&_limit=4`
    );
    updateSalesHistory(data);
  };

  const getBidList = async () => {
    const { data } = await api.get(
      `bid_list?uuid=${userInfo?.uuid}&_sort=-created_at&_limit=4`
    );
    updateBidList(data);
  };

  const getBidAward = async () => {
    const { data } = await api.get(
      `bid_award?uuid=${userInfo?.uuid}&_sort=-created_at&_limit=4`
    );
    updateBidAward(data);
  };

  const getFavorite = async () => {
    const { data } = await api.get(
      `favorite?uuid=${userInfo?.uuid}&_sort=-created_at&_limit=4`
    );
    setUserFavorite(data);
  };

  const handelLogout = () => {
    logout();
    alert("logout");
    location.href = "/";
  };

  return (
    <MypageLayout>
      <div className="mypage_user">
        <img src={defaultImg} alt="default_image" />
        <div>
          <div className="user_info">
            <p className="nickname">{userInfo?.nickname}</p>
            <p className="email">{userInfo?.email}</p>
          </div>
          <div className="btns">
            <CommonButton
              text="로그아웃"
              btnType="small"
              onClick={handelLogout}
            />
          </div>
        </div>
      </div>

      <section>
        <CommonTitle
          type={3}
          title="최근 판매 물품 목록"
          link={Boolean(salesHistory?.length) && "list"}
        />
        {salesHistory?.length ? (
          <>
            <CommonList grid={4}>
              {salesHistory?.map((post) => {
                return (
                  <Link to={`/auction/${post?.id}`} key={post?.id}>
                    <CommonListItem
                      src={post?.src}
                      category={findCategory(post?.category_id)}
                      title={post?.title}
                      startPrice={post?.start_price}
                      isOpen={Boolean(post.is_open)}
                    />
                  </Link>
                );
              })}
            </CommonList>
          </>
        ) : (
          <CommonNodataBox>
            <div>판매한 물품이 없습니다</div>
            <Link to="/sell">판매글 작성하러 가기 〉</Link>
          </CommonNodataBox>
        )}
      </section>

      <section>
        <CommonTitle
          type={3}
          title="나의 입찰 내역"
          link={Boolean(bidList?.length) && "bid"}
        />
        {bidList?.length ? (
          <>
            <CommonList grid={4}>
              {bidList?.map((item, idx) => (
                <CommonListItem
                  key={`bidlist_${idx}`}
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                />
              ))}
            </CommonList>
          </>
        ) : (
          <CommonNodataBox>
            <div>나의 입찰 내역이 없습니다.</div>
          </CommonNodataBox>
        )}
      </section>

      <section>
        <CommonTitle
          type={3}
          title="나의 낙찰 내역"
          link={Boolean(bidAward?.length) && "award"}
        />
        {bidAward?.length ? (
          <>
            <CommonList grid={4}>
              {bidAward?.map((post, idx) => (
                <Link to={`/auction/${post?.item_id}`} key={`award_${idx}`}>
                  <CommonListItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    startPrice={post?.amount}
                    isOpen={false}
                  />
                </Link>
              ))}
            </CommonList>
          </>
        ) : (
          <CommonNodataBox>
            <div>낙찰받은 내역이 없습니다</div>
          </CommonNodataBox>
        )}
      </section>

      <section>
        <CommonTitle
          type={3}
          title="좋아요/관심/즐겨찾기 리스트"
          link={Boolean(userFavorite?.length) && "favorite"}
        />
        {userFavorite.length ? (
          <>
            <CommonList grid={4}>
              {userFavorite?.map((post, idx) => (
                <Link to={`/auction/${post?.item_id}`} key={`favorite_${idx}`}>
                  <CommonListItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    startPrice={post?.start_price}
                  />
                </Link>
              ))}
            </CommonList>
          </>
        ) : (
          <CommonNodataBox>
            <div>좋아요 내역이 없습니다</div>
          </CommonNodataBox>
        )}
      </section>
    </MypageLayout>
  );
}
