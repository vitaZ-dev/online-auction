import MypageList from "../../components/pages/mypage/MypageList";

export default function MyBidAward() {
  // 낙찰 내역
  return (
    <>
      <MypageList collectionPath="bid_list" filterOpen={false} />
    </>
  );
}
