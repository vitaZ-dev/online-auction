import MypageList from "../../components/pages/mypage/MypageList";

export default function MyFavoriteList() {
  // 좋아요 리스트
  return (
    <>
      <MypageList collectionPath="favorite" filterOpen={false} />
    </>
  );
}
