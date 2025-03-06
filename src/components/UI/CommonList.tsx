import { Skeleton } from "@mui/material";
import { AuctionListLayout } from "../../styles/CommonStyle";
import { useEffect, useState } from "react";

export default function CommonList({
  grid = 2,
  loading = false,
  children,
}: {
  grid?: number;
  loading?: boolean;
  children;
}) {
  const [height, setHeight] = useState(200);

  useEffect(() => {
    grid === 2 ? setHeight(200) : setHeight(100);
  }, [grid]);

  return (
    <>
      <AuctionListLayout grid={grid}>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, idx) => (
              <>
                <div key={idx}>
                  <Skeleton
                    variant="rounded"
                    height={height}
                    animation="wave"
                  />
                  <Skeleton width={"30%"} height={20} animation="wave" />
                  <Skeleton variant="text" height={16} animation="wave" />
                  <Skeleton variant="text" height={16} animation="wave" />
                </div>
              </>
            ))
        ) : (
          <>{children}</>
        )}
      </AuctionListLayout>
    </>
  );
}
