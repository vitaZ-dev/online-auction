/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { PaginationLayout } from "../../styles/CommonStyle";
// import { useSearchParams } from "react-router-dom";

export default function Pagination({ pageInfo }: any) {
  const [pageList, setPageList] = useState([1]);

  // const [query, setQuery] = useSearchParams();
  // const currentPage = query.get("page")
  //   ? parseInt(query.get("page") as string)
  //   : 1;

  useEffect(() => {
    console.log("pagi", pageInfo);
    // pagination per 5
    const startIndex = Math.floor((pageInfo.now_page - 1) / 5) * 1;
    const lastIndex =
      startIndex + 4 > pageInfo.total_page
        ? pageInfo.total_page
        : startIndex + 4;

    const pageArr = [...Array(lastIndex - startIndex + 1)].map(
      (_, i) => startIndex + i + 1
    );
    setPageList(pageArr);
  }, [pageInfo]);

  return (
    <PaginationLayout>
      <button disabled={!pageInfo.prev_page}>≪</button>
      <button disabled={!pageInfo.prev_page}>◁</button>
      {pageList.map((page) => (
        <button role="button" key={page}>
          {page}
        </button>
      ))}
      <button disabled={!pageInfo.next_page}>▷</button>
      <button disabled={!pageInfo.next_page}>≫</button>
    </PaginationLayout>
  );
}
