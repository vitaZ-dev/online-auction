import { Link } from "react-router-dom";
import { HomeLayout, SwiperLayout } from "../styles/HomeStyle";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionListLayout } from "../styles/CommonStyle";
import ListItem from "../components/ListItem";
import { CATEGORY, findCategory } from "../modules/category";

import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    getRecentList();
  }, []);

  const getRecentList = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?_sort=-created_at&_page=1&_per_page=4`
    );
    const favorite = await axios.get(
      `http://localhost:4000/posts?_sort=-favorite&favorite_gte=1&_page=1&_per_page=4`
    );

    setRecent(data.data);
    setFavorite(favorite.data.data);
  };

  return (
    <HomeLayout>
      <h1>Home</h1>
      <section className="category_list">
        <h3 className="title">인기 카테고리</h3>
        <div className="h200">
          <Link to="/auction">더 보기</Link>
          <Swiper
            // modules={[Navigation]}
            // navigation={true}
            spaceBetween={16}
            slidesPerView={4}
          >
            {CATEGORY.map((item) => {
              return (
                <SwiperSlide key={`cate_${item.category_id}`}>
                  <Link
                    to={`/auction?category_id=${item.category_id}`}
                    key={`cate_${item.category_id}`}
                  >
                    <SwiperLayout>
                      <div className="category_img">
                        <div className="img_wrap">f</div>
                      </div>
                      <div className="category_title">{item.category_name}</div>
                    </SwiperLayout>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
      <section className="recent_list">
        <h3 className="title">최근 올라온 물품</h3>
        <div>
          <AuctionListLayout grid={4}>
            {recent?.map((r) => {
              return (
                <Link to={`/auction/${r?.id}`} key={r?.id}>
                  <ListItem
                    src={r?.src}
                    category={findCategory(r?.category_id)}
                    title={r?.title}
                    contents={r?.contents}
                  />
                </Link>
              );
            })}
          </AuctionListLayout>
        </div>
      </section>
      <section className="ranking_list">
        <h3 className="title">즐겨찾기 랭킹</h3>
        <div>
          {favorite.length ? (
            <AuctionListLayout grid={4}>
              {favorite?.map((r) => {
                return (
                  <Link to={`/auction/${r?.id}`} key={r?.id}>
                    <ListItem
                      src={r?.src}
                      category={findCategory(r?.category_id)}
                      title={r?.title}
                      contents={r?.contents}
                    />
                  </Link>
                );
              })}
            </AuctionListLayout>
          ) : (
            <div>no data</div>
          )}
        </div>
      </section>
      <section className="auction_guide">
        <h3 className="title">online-auction 가이드</h3>
        <div className="guide_wrap">
          <div className="left">How to Buy</div>
          <div className="right">How to Sell</div>
        </div>
      </section>
    </HomeLayout>
  );
}
