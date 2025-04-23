import { useInfiniteQuery } from "react-query";
// import { useInfiniteQuery } from "@tanstack/react-query";

const useInfiniteScroll = (
  queryKey: Array<string | number>,
  getFn: (arg0: any) => any
) => {
  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getFn(pageParam); // API GET 함수;
    },
    getNextPageParam: (pageItems) => {
      return pageItems.page < pageItems.totalPages
        ? pageItems.page + 1
        : undefined;
    },
    // enabled: false, // 자동 fetch 방지
  });

  const handleRefetch = () => query.refetch(); // 수동 호출

  return {
    ...query,
    handleRefetch,
  };
};

export default useInfiniteScroll;
