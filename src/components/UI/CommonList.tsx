import { AuctionListLayout } from "../../styles/CommonStyle";

export default function CommonList({
  grid = 2,
  children,
}: {
  grid?: number;
  children;
}) {
  return (
    <>
      <AuctionListLayout grid={grid}>{children}</AuctionListLayout>
    </>
  );
}
