/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import defaultImg from "/images/profile_default.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { findCategory } from "../../modules/category";
import ListPerItem from "../../components/ListPerItem";
import { AuctionListLayout } from "../../styles/CommonStyle";
import CommonTitle from "../../components/UI/CommonTitle";

export default function Mypage() {
  const [userPost, setUserPost] = useState([]);
  const [userFavorite, setUserFavorite] = useState([]);
  const { userInfo, favorite, bidList } = useAuthStore();

  useEffect(() => {
    const favoriteFilter = favorite?.reduce((acc: any[], item: any) => {
      if (acc.length < 6) acc.push(item);
      return acc;
    }, []);
    setUserFavorite(favoriteFilter);

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?user_id=${userInfo?.uuid}&_sort=-created_at&_limit=4`
    );

    setUserPost(data);
  };

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
        <CommonTitle
          type={3}
          title="최근 판매 물품 목록"
          link={Boolean(userPost?.length) && "list"}
        />
        {userPost.length ? (
          <>
            <AuctionListLayout grid={4}>
              {userPost?.map((post) => {
                return (
                  <Link to={`/auction/${post?.id}`} key={post?.id}>
                    <ListPerItem
                      src={post?.src}
                      category={findCategory(post?.category_id)}
                      title={post?.title}
                      startPrice={post?.start_price}
                    />
                  </Link>
                );
              })}
            </AuctionListLayout>
          </>
        ) : (
          <>
            <div>판매한 물품이 없습니다</div>
            <Link to="/sell">판매글 작성하러 가기 〉</Link>
          </>
        )}
      </section>
      <br />
      <section>
        <CommonTitle
          type={3}
          title="나의 입찰 내역"
          link={Boolean(bidList?.length) && "bid"}
        />
        {bidList?.length ? (
          <>
            <AuctionListLayout grid={4}>
              {bidList?.map((item) => (
                <ListPerItem
                  key={item?.id}
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                />
              ))}
            </AuctionListLayout>
          </>
        ) : (
          <div>나의 입찰 내역이 없습니다.</div>
        )}
      </section>
      <br />
      <section>
        <CommonTitle
          type={3}
          title="좋아요/관심/즐겨찾기 리스트"
          link={Boolean(userFavorite?.length) && "favorite"}
        />
        {userFavorite.length ? (
          <>
            <AuctionListLayout grid={4}>
              {userFavorite?.map((post) => (
                <Link to={`/auction/${post?.id}`} key={post?.id}>
                  <ListPerItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    startPrice={post?.start_price}
                  />
                </Link>
              ))}
            </AuctionListLayout>
          </>
        ) : (
          <div>좋아요 내역이 없습니다</div>
        )}
      </section>
    </MypageLayout>
  );
}
