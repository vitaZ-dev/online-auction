import { useInfiniteQuery } from "react-query";
// import { useInfiniteQuery } from "@tanstack/react-query";

const useInfiniteScroll = (queryKey: string[], getFn: (arg0: any) => any) => {
  return useInfiniteQuery({
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
  });
};

export default useInfiniteScroll;
