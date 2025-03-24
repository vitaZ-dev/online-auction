import { Link } from "react-router-dom";
import { HomeLayout, SwiperItem, SwiperLayout } from "../styles/HomeStyle";
import { useEffect, useState } from "react";
import api from "../apis/api";
import CommonList from "../components/UI/CommonList";
import CommonListItem from "../components/UI/CommonListItem";
import { CATEGORY, findCategory } from "../modules/category";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import CommonTitle from "../components/UI/CommonTitle";
import { CommonNodataBox } from "../styles/CommonStyle";
import { postType } from "../types/post";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

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
    const { data } = await api.get(
      `posts?_sort=created_at&_order=desc&_page=1&_limit=4`
    );
    setRecent(data);
    setIsRecentData(data?.length !== 0);
    setRecentLoading(false);
  };
  const getFavoriteList = async () => {
    setFavoriteLoading(true);
    const { data } = await api.get(
      `posts?_sort=favorite,created_at&_order=desc,desc&favorite_gte=1&_page=1&_limit=4`
    );
    setFavoriteLoading(false);
    setIsFavoriteData(data?.length !== 0);
    setFavorite(data);
  };

  return (
    <HomeLayout>
      <section className="category_list">
        <CommonTitle type={3} title="인기 카테고리" />
        <SwiperLayout>
          <button className="swiper-btn prev">
            <NavigateBeforeIcon />
          </button>
          <button className="swiper-btn next">
            <NavigateNextIcon />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-btn.next",
              prevEl: ".swiper-btn.prev",
            }}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              280: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 20,
              },
              475: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 4,
                slidesPerGroup: 4,
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
                  <SwiperItem>
                    <div className="category_img">
                      <div className="img_wrap"></div>
                    </div>
                    <div className="category_title">{item.category_name}</div>
                  </SwiperItem>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperLayout>
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
          title="좋아요 랭킹"
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
            <CommonNodataBox>
              좋아요가 클릭된 게시글이 없습니다.
            </CommonNodataBox>
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
