import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";

export default function MyFavoriteList() {
  const { userInfo, favorite } = useAuthStore();

  return (
    <MypageLayout>
      <CommonTitle
        type={1}
        title={`${userInfo?.nickname} 님의 좋아요 리스트`}
      />
      <section>
        {favorite?.length ? (
          <CommonList grid={4}>
            {favorite?.map((post) => {
              return (
                <Link to={`/auction/${post?.id}`} key={post?.id}>
                  <CommonListItem
                    src={post?.src}
                    category={findCategory(post?.category_id)}
                    title={post?.title}
                    startPrice={post?.start_price}
                    isOpen={post.is_open}
                  />
                </Link>
              );
            })}
          </CommonList>
        ) : (
          <p>내가 좋아요 한 물품이 없습니다</p>
        )}
        <Link to="/mypage">마이페이지로 돌아가기</Link>
      </section>
    </MypageLayout>
  );
}
