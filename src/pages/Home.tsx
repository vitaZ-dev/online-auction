import { Link } from "react-router-dom";
import { HomeLayout, SwiperLayout } from "../styles/HomeStyle";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonList from "../components/UI/CommonList";
import CommonListItem from "../components/UI/CommonListItem";
import { CATEGORY, findCategory } from "../modules/category";

import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import CommonTitle from "../components/UI/CommonTitle";
import { CommonNodataBox } from "../styles/CommonStyle";
import { postType } from "../types/post";

export default function Home() {
  const [recent, setRecent] = useState<Array<postType> | []>([]);
  const [favorite, setFavorite] = useState<Array<postType> | []>([]);

  const [recentLoading, setRecentLoading] = useState<boolean>(true);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(true);

  const [isRecentData, setIsRecentData] = useState<boolean>(true);
  const [isFavoriteData, setIsFavoriteData] = useState<boolean>(true);

  useEffect(() => {
    getRecentList();
    getFavoriteList();
  }, []);

  const getRecentList = async () => {
    setRecentLoading(true);
    const { data } = await axios.get(
      `http://localhost:4000/posts?_sort=-created_at&_page=1&_per_page=4`
    );
    setRecent(data.data);
    setIsRecentData(data.data.length !== 0);
    setRecentLoading(false);
  };
  const getFavoriteList = async () => {
    setFavoriteLoading(true);
    const { data } = await axios.get(
      `http://localhost:4000/posts?_sort=-favorite&favorite_gte=1&_page=1&_per_page=4`
    );
    setFavoriteLoading(false);
    setIsFavoriteData(data.data.length !== 0);
    setFavorite(data.data);
  };

  return (
    <HomeLayout>
      <section className="category_list">
        <CommonTitle type={3} title="인기 카테고리" />
        <div style={{ padding: 16 }}>
          <Swiper
            // modules={[Navigation]}
            // navigation={true}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              280: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              475: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {CATEGORY.map((item) => (
              <SwiperSlide key={`cate_${item.category_id}`}>
                <Link
                  to={`/auction?category_id=${item.category_id}`}
                  key={`cate_${item.category_id}`}
                >
                  <SwiperLayout>
                    <div className="category_img">
                      <div className="img_wrap"></div>
                    </div>
                    <div className="category_title">{item.category_name}</div>
                  </SwiperLayout>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="recent_list">
        <CommonTitle type={3} title="최근 올라온 물품" link="/auction" />
        <div>
          {isRecentData ? (
            <CommonList grid={4} loading={recentLoading}>
              {recent?.map((r) => (
                <Link to={`/auction/${r?.id}`} key={r?.id}>
                  <CommonListItem
                    src={r?.src}
                    category={findCategory(r?.category_id)}
                    title={r?.title}
                    startPrice={r?.start_price}
                    isOpen={Boolean(r.is_open)}
                  />
                </Link>
              ))}
            </CommonList>
          ) : (
            <CommonNodataBox>게시글이 없습니다.</CommonNodataBox>
          )}
        </div>
      </section>
      <section className="ranking_list">
        <CommonTitle
          type={3}
          title="즐겨찾기 랭킹"
          link="/auction?sort_by=favorite"
        />
        <div>
          {isFavoriteData ? (
            <CommonList grid={4} loading={favoriteLoading}>
              {favorite?.map((r) => {
                return (
                  <Link to={`/auction/${r?.id}`} key={r?.id}>
                    <CommonListItem
                      src={r?.src}
                      category={findCategory(r?.category_id)}
                      title={r?.title}
                      startPrice={r?.start_price}
                      isOpen={Boolean(r.is_open)}
                    />
                  </Link>
                );
              })}
            </CommonList>
          ) : (
            <CommonNodataBox>즐겨찾기된 게시글이 없습니다.</CommonNodataBox>
          )}
        </div>
      </section>
      <section className="auction_guide">
        <CommonTitle type={3} title="online-auction 가이드" />
        <div className="guide_wrap">
          <div className="left">
            <p className="title">How to Buy</p>
            <p className="desc">
              회원가입부터 응찰까지 누구나 <br />
              쉽게 경매에 참여할 수 있습니다.
            </p>
            <Link to="/guide">알아보기</Link>
          </div>
          <div className="right">
            <p className="title">How to Sell</p>
            <p className="desc">
              회원가입부터 응찰까지 누구나 <br />
              쉽게 경매에 참여할 수 있습니다.
            </p>
            <Link to="/guide">알아보기</Link>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
