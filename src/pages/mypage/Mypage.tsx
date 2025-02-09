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
      `http://localhost:4000/posts?user_id=${userInfo?.uuid}&_sort=-created_at&_limit=6`
    );

    // const filterPost = data.reduce((acc: any[], item: any) => {
    //   if (acc.length < 6) acc.push(item);
    //   return acc;
    // }, []);
    // setUserPost(filterPost);

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
        <h3>최근 판매 물품 목록</h3>
        {userPost.length ? (
          <>
            <AuctionListLayout grid={3}>
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
            <Link to="list">더 보기 〉</Link>
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
        <h3>나의 입찰 내역</h3>
        {bidList?.length ? (
          <>
            <AuctionListLayout grid={3}>
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
            <Link to="bid">더 보기 〉</Link>
          </>
        ) : (
          <div>나의 입찰 내역이 없습니다.</div>
        )}
      </section>
      <br />
      <section>
        <h3>좋아요/관심/즐겨찾기 리스트</h3>
        {userFavorite.length ? (
          <>
            <AuctionListLayout grid={3}>
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
            <Link to="favorite">더 보기 〉</Link>
          </>
        ) : (
          <div>좋아요 내역이 없습니다</div>
        )}
      </section>
    </MypageLayout>
  );
}
