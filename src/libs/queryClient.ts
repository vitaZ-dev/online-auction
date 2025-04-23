import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // staleTime 동안 데이터가 신선하다고 간주
      gcTime: Infinity, // cacheTime 동안 캐시 유지
      refetchOnWindowFocus: false, // 화면 전환 시 쿼리 재실행 방지
      refetchOnReconnect: false, // 재연결 시 쿼리 재실행 방지
    },
  },
});

export default queryClient;
