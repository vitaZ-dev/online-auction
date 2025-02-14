import useAuthStore from "../../stores/useAuthStore";
import { AuctionListLayout } from "../../styles/CommonStyle";
import { MypageLayout } from "../../styles/MypageStyle";
import ListPerItem from "../../components/ListPerItem";
import { findCategory } from "../../modules/category";
import { useState } from "react";
import ShowBidList from "../../components/mypage/ShowBidList";
import CommonTitle from "../../components/UI/CommonTitle";

export default function MyBidList() {
  const { userInfo, bidHistory, bidList } = useAuthStore();

  const [toggle, setToggle] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [bidContents, setBidContents] = useState([]);

  const handleDetailBid = (id: string, title: string) => {
    const re = bidHistory.filter((item) => item.id === id);
    setBidContents(re);
    setDetailTitle(title);
    setToggle(true);
  };

  return (
    <MypageLayout>
      <CommonTitle type={1} title={`${userInfo?.nickname} 님의 입찰 내역들`} />

      {bidList?.length ? (
        <>
          <AuctionListLayout grid={4}>
            {bidList?.map((item) => (
              <div
                key={item?.id}
                onClick={() => handleDetailBid(item.id, item.title)}
              >
                {/* <Link to={`/auction/${item?.id}`} key={item?.id}> */}
                <ListPerItem
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                />
                {/* </Link> */}
              </div>
            ))}
          </AuctionListLayout>
        </>
      ) : (
        <div>나의 입찰 내역이 없습니다.</div>
      )}
      {toggle && (
        <ShowBidList
          title={detailTitle}
          contents={bidContents}
          setToggle={setToggle}
        />
      )}
    </MypageLayout>
  );
}
