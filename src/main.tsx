import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
  // useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense } from "react";

// import useAuthStore from "./stores/useAuthStore.ts";

import "./index.css";

import App from "./App.tsx";
// import Container from "./pages/Container.tsx";
import Loading from "./components/Loading.tsx";
import Home from "./pages/Home.tsx";
import List from "./pages/auction/List.tsx";
import Detail from "./pages/auction/Detail.tsx";
import Result from "./pages/auction/Result.tsx";
import Sell from "./pages/sell/Sell.tsx";
import Edit from "./pages/sell/Edit.tsx";
import MyList from "./pages/sell/MyList.tsx";
import Guide from "./pages/guide/Guide.tsx";
import Mypage from "./pages/mypage/Mypage.tsx";
import MySellList from "./pages/mypage/MySellList.tsx";
import MyFavoriteList from "./pages/mypage/MyFavoriteList.tsx";
import MyBidList from "./pages/mypage/MyBidList.tsx";
import MyBidAward from "./pages/mypage/MyBidAward.tsx";
import Login from "./pages/login/Login.tsx";
import Register from "./pages/login/Register.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/auction",
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <List />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<Loading />}>
                <Detail />
              </Suspense>
            ),
          },
          {
            path: "result",
            element: (
              <Suspense fallback={<Loading />}>
                <Result />
              </Suspense>
            ),
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
            element: <Sell />,
          },
          {
            path: ":id",
            element: <Edit />,
          },
          {
            path: "mylist",
            element: <MyList />,
          },
        ],
      },
      {
        path: "/mypage",
        loader: requireAuth,
        children: [
          {
            path: "",
            element: <Mypage />,
          },
          {
            path: "list",
            element: <MySellList />,
          },
          {
            path: "favorite",
            element: <MyFavoriteList />,
          },
          {
            path: "bid",
            element: <MyBidList />,
          },
          {
            path: "award",
            element: <MyBidAward />,
          },
        ],
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
    loader: loginNoAccess,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*", // 모든 경로에 대해 매칭
    element: <NotFound />, // 404 페이지 컴포넌트
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
