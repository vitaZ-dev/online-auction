import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CommonTitle from "../components/common/CommonTitle";
import CommonList from "../components/common/CommonList";
import CommonListItem from "../components/common/CommonListItem";
import { CATEGORY, findCategory } from "../constants/category";
import { HomeLayout, SwiperItem, SwiperLayout } from "../styles/HomeStyle";
import "swiper/swiper-bundle.css";
import { CommonNodataBox } from "../styles/CommonStyle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getFavoriteList, getRecentList } from "../apis/libs";

export default function Home() {
  const getRecentListWait = async () => {
    try {
      const res = await getRecentList();
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getFavoriteListWait = async () => {
    try {
      const res = await getFavoriteList();
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const [recentQuery, favoriteQuery] = useQueries({
    queries: [
      {
        queryKey: ["home", "recent"],
        queryFn: () => getRecentListWait(),
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
      },
      {
        queryKey: ["home", "favorite"],
        queryFn: () => getFavoriteListWait(),
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
      },
    ],
  });

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
          {!recentQuery.isLoading &&
          (!recentQuery.data || recentQuery.data?.length === 0) ? (
            <CommonNodataBox>게시글이 없습니다.</CommonNodataBox>
          ) : (
            <CommonList grid={4} loading={recentQuery.isLoading}>
              {recentQuery?.data?.map((r, idx) => (
                <Link to={`/auction/${r?.id}`} key={idx}>
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
          {!favoriteQuery.isLoading &&
          (!favoriteQuery.data || favoriteQuery.data?.length === 0) ? (
            <CommonNodataBox>
              좋아요가 클릭된 게시글이 없습니다.
            </CommonNodataBox>
          ) : (
            <CommonList grid={4} loading={favoriteQuery.isLoading}>
              {favoriteQuery?.data?.map((r, idx) => (
                <Link to={`/auction/${r?.id}`} key={idx}>
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
