import { Link } from "react-router-dom";
import { HomeLayout } from "../styles/HomeStyle";

export default function Home() {
  return (
    <HomeLayout>
      <h1>Home</h1>
      <section className="category_list">
        <h3 className="title">인기 카테고리</h3>
        <div className="h200">
          <Link to="/auction">더 보기</Link>
        </div>
      </section>
      <section className="recent_list">
        <h3 className="title">최근 올라온 물품</h3>
        <div className="h200"></div>
      </section>
      <section className="popular_list">
        <h3 className="title">인기 랭킹</h3>
        <div className="h200"></div>
      </section>
      <section className="ranking_list">
        <h3 className="title">즐겨찾기 랭킹</h3>
        <div className="h200"></div>
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
