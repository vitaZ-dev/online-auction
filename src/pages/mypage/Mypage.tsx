import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import defaultImg from "/images/profile_default.png";
import { findCategory } from "../../constants/category";
import useAuthStore from "../../stores/useAuthStore";
import { CommonNodataBox } from "../../styles/CommonStyle";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonButton from "../../components/common/CommonButton";
import {
  mypageAwardList,
  mypageBidList,
  mypageFavorite,
  mypageRecentList,
} from "../../apis/libs";
import { signOut } from "firebase/auth";
import { auth } from "../../libs/firebase";
import queryClient from "../../libs/queryClient";

export default function Mypage() {
  const { isLogin, userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: recentList, isLoading: recentLoading } = useQuery({
    queryKey: ["mypage", "recent", userInfo?.uuid],
    queryFn: () => mypageRecentList(userInfo?.uuid as string),
    enabled: isLogin,
  });

  const { data: bidList, isLoading: bidLoading } = useQuery({
    queryKey: ["mypage", "bid_list", userInfo?.uuid],
    queryFn: () => mypageBidList(userInfo?.uuid as string),
    enabled: isLogin,
  });

  const { data: bidAward, isLoading: awardLoading } = useQuery({
    queryKey: ["mypage", "bid_award", userInfo?.uuid],
    queryFn: () => mypageAwardList(userInfo?.uuid as string),
    gcTime: 60 * 60 * 1000,
    enabled: isLogin,
  });

  const { data: favoriteList, isLoading: favoriteLoading } = useQuery({
    queryKey: ["mypage", "favorite", userInfo?.uuid],
    queryFn: () => mypageFavorite(userInfo?.uuid as string),
    enabled: isLogin,
  });

  const handelLogout = async () => {
    try {
      await signOut(auth);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "mypage",
      });
      queryClient.getQueryCache().clear();
      alert("로그아웃 되었습니다.");
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("로그아웃에 실패했습니다.");
    }
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
          link={Boolean(recentList?.length) && "list"}
        />
        {recentList?.length || recentLoading ? (
          <>
            <CommonList grid={4} loading={recentLoading}>
              {recentList?.map((post) => {
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
        {bidList?.length || bidLoading ? (
          <>
            <CommonList grid={4} loading={bidLoading}>
              {bidList?.map((item, idx) => (
                <Link to={`/auction/${item?.item_id}`} key={`bidlist_${idx}`}>
                  <CommonListItem
                    key={`bidlist_${idx}`}
                    src={item?.src}
                    category={findCategory(item?.category_id)}
                    title={item?.title}
                    startPrice={item?.start_price}
                  />
                </Link>
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
        {bidAward?.length || awardLoading ? (
          <>
            <CommonList grid={4} loading={awardLoading}>
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
          title="좋아요 리스트"
          link={Boolean(favoriteList?.length) && "favorite"}
        />
        {favoriteList?.length || favoriteLoading ? (
          <>
            <CommonList grid={4} loading={favoriteLoading}>
              {favoriteList?.map((post, idx) => (
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
