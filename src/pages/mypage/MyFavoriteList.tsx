import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { AuctionListLayout } from "../../styles/CommonStyle";
import { MypageLayout } from "../../styles/MypageStyle";
import ListPerItem from "../../components/ListPerItem";
import { findCategory } from "../../modules/category";

export default function MyFavoriteList() {
  const { userInfo, favorite } = useAuthStore();

  return (
    <MypageLayout>
      <h1>{userInfo?.nickname} 님의 좋아요 리스트</h1>
      <section>
        {favorite?.length ? (
          <AuctionListLayout grid={4}>
            {favorite?.map((post) => {
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
        ) : (
          <p>내가 판매한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
