import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "react-query";
import { lazy, ReactNode, Suspense } from "react";

import "./index.css";

import App from "./App.tsx";
import Loading from "./components/Loading.tsx";
const Home = lazy(() => import("./pages/Home.tsx"));
const List = lazy(() => import("./pages/auction/List.tsx"));
const Detail = lazy(() => import("./pages/auction/Detail.tsx"));
const Result = lazy(() => import("./pages/auction/Result.tsx"));
const Sell = lazy(() => import("./pages/sell/Sell.tsx"));
const Edit = lazy(() => import("./pages/sell/Edit.tsx"));
const MyList = lazy(() => import("./pages/sell/MyList.tsx"));
const Guide = lazy(() => import("./pages/guide/Guide.tsx"));
const Mypage = lazy(() => import("./pages/mypage/Mypage.tsx"));
const MySellList = lazy(() => import("./pages/mypage/MySellList.tsx"));
const MyFavoriteList = lazy(() => import("./pages/mypage/MyFavoriteList.tsx"));
const MyBidList = lazy(() => import("./pages/mypage/MyBidList.tsx"));
const MyBidAward = lazy(() => import("./pages/mypage/MyBidAward.tsx"));
const Login = lazy(() => import("./pages/login/Login.tsx"));
const Register = lazy(() => import("./pages/login/Register.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
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

/**
 * TODO lazy loading & Suspense & loading component
 */
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
          {
            path: "result",
            element: lazyComponent(<Result />),
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
          {
            path: "mylist",
            element: lazyComponent(<MyList />),
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
      {
        path: "/about",
        element: lazyComponent(<About />),
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

// const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  // </QueryClientProvider>
);
