import { lazy, ReactNode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./libs/queryClient.ts";

import "./index.css";

import App from "./App.tsx";
import Loading from "./components/UI/Loading.tsx";
const Home = lazy(() => import("./pages/Home.tsx"));
const List = lazy(() => import("./pages/auction/List.tsx"));
const Detail = lazy(() => import("./pages/auction/Detail.tsx"));
// const Result = lazy(() => import("./pages/auction/Result.tsx"));
const SellerItems = lazy(() => import("./pages/auction/SellerItems.tsx"));
const Sell = lazy(() => import("./pages/sell/Sell.tsx"));
const Edit = lazy(() => import("./pages/sell/Edit.tsx"));
const Guide = lazy(() => import("./pages/guide/Guide.tsx"));
const Mypage = lazy(() => import("./pages/mypage/Mypage.tsx"));
const MySellList = lazy(() => import("./pages/mypage/MySellList.tsx"));
const MyFavoriteList = lazy(() => import("./pages/mypage/MyFavoriteList.tsx"));
const MyBidList = lazy(() => import("./pages/mypage/MyBidList.tsx"));
const MyBidAward = lazy(() => import("./pages/mypage/MyBidAward.tsx"));
const Login = lazy(() => import("./pages/login/Login.tsx"));
const Register = lazy(() => import("./pages/login/Register.tsx"));
const Services = lazy(() => import("./pages/services/Services.tsx"));
const Faq = lazy(() => import("./pages/services/Faq.tsx"));
const Notice = lazy(() => import("./pages/services/Notice.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const requireAuth: LoaderFunction = () => {
  // const auth = useAuthStore((state) => state.isLogin);
  // const auth = useAuthStore.getState().isLogin;
  const storage = localStorage.getItem("online_auction");
  const auth = storage ? JSON.parse(storage)?.state?.isLogin : null;

  // const navigate = useNavigate();

  if (!auth) {
    // navigate("/login");
    location.href = "/login";
  }
  return null;
};

const loginNoAccess: LoaderFunction = () => {
  const storage = localStorage.getItem("online_auction");
  const auth = storage ? JSON.parse(storage)?.state?.isLogin : null;

  if (auth) location.href = "/";
  return null;
};

function lazyComponent(element: ReactNode): ReactNode {
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: lazyComponent(<App />),
    children: [
      {
        path: "",
        element: lazyComponent(<Home />),
      },
      {
        path: "/auction",
        children: [
          {
            path: "",
            element: lazyComponent(<List />),
          },
          {
            path: ":id",
            element: lazyComponent(<Detail />),
          },
          // {
          //   path: "result",
          //   element: lazyComponent(<Result />),
          // },
          {
            path: "items/:sellerID",
            element: lazyComponent(<SellerItems />),
          },
        ],
      },
      {
        path: "/guide",
        element: <Guide />,
      },
      {
        path: "/sell",
        loader: requireAuth,
        children: [
          {
            path: "",
            element: lazyComponent(<Sell />),
          },
          {
            path: ":id",
            element: lazyComponent(<Edit />),
          },
        ],
      },
      {
        path: "/services",
        children: [
          {
            path: "",
            element: lazyComponent(<Services />),
          },
          {
            path: "faq",
            element: lazyComponent(<Faq />),
          },
          {
            path: "notice",
            element: lazyComponent(<Notice />),
          },
        ],
      },
      {
        path: "/mypage",
        loader: requireAuth,
        children: [
          {
            path: "",
            element: lazyComponent(<Mypage />),
          },
          {
            path: "list",
            element: lazyComponent(<MySellList />),
          },
          {
            path: "favorite",
            element: lazyComponent(<MyFavoriteList />),
          },
          {
            path: "bid",
            element: lazyComponent(<MyBidList />),
          },
          {
            path: "award",
            element: lazyComponent(<MyBidAward />),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: lazyComponent(<App />),
    loader: loginNoAccess,
    children: [
      {
        path: "",
        element: lazyComponent(<Login />),
      },
      {
        path: "register",
        element: lazyComponent(<Register />),
      },
    ],
  },
  {
    path: "*", // 모든 경로에 대해 매칭
    element: <NotFound />, // 404 페이지 컴포넌트
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
