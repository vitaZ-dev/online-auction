import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { AuctionListLayout } from "../../styles/CommonStyle";
import { MypageLayout } from "../../styles/MypageStyle";
import ListPerItem from "../../components/ListPerItem";
import { findCategory } from "../../modules/category";
// import ShowBidList from "../../components/mypage/ShowBidList";

export default function MyBidList() {
  const { userInfo, bidHistory, bidList } = useAuthStore();

  return (
    <MypageLayout>
      <h1>{userInfo?.nickname} 님의 입찰 내역들</h1>
      {bidList?.length ? (
        <>
          <AuctionListLayout grid={4}>
            {bidList?.map((item) => (
              <div key={item?.id}>
                <Link to={`/auction/${item?.id}`} key={item?.id}>
                  <ListPerItem
                    src={item?.src}
                    category={findCategory(item?.category_id)}
                    title={item?.title}
                    startPrice={item?.start_price}
                  />
                </Link>
              </div>
            ))}
          </AuctionListLayout>
        </>
      ) : (
        <div>나의 입찰 내역이 없습니다.</div>
      )}
      {/* <ShowBidList /> */}
    </MypageLayout>
  );
}
