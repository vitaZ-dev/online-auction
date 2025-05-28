// import { useInfiniteQuery } from "react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import queryClient from "../../libs/queryClient";

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
      const totalPage =
        queryClient.getQueryData<{ pages: any }>(["fb-test"])?.pages?.[0]
          ?.totalPages ?? 1;
      return pageItems.page < totalPage ? pageItems.page + 1 : undefined;
    },
    // enabled: false, // 자동 fetch 방지
    staleTime: 20 * 1000,
    gcTime: 20 * 1000,
  });

  const handleRefetch = () => query.refetch(); // 수동 호출

  return {
    ...query,
    handleRefetch,
  };
};

export default useInfiniteScroll;
