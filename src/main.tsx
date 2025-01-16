import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
  // useNavigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

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
import MyList from "./pages/sell/MyList.tsx";
import Guide from "./pages/guide/Guide.tsx";
import Mypage from "./pages/mypage/Mypage.tsx";
import Login from "./pages/login/Login.tsx";
import Register from "./pages/login/Register.tsx";
const About = lazy(() => import("./pages/About"));

const requireAuth: LoaderFunction = () => {
  // const auth = useAuthStore((state) => state.loginCheck);
  // const auth = useAuthStore.getState().loginCheck;
  const storage = localStorage.getItem("online_auction");
  const auth = storage ? JSON.parse(storage)?.state?.loginCheck : null;

  // const navigate = useNavigate();

  if (!auth) {
    // navigate("/login");
    location.href = "/login";
  }
  return null;
};

const loginNoAccess: LoaderFunction = () => {
  const storage = localStorage.getItem("online_auction");
  const auth = storage ? JSON.parse(storage)?.state?.loginCheck : null;

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
        path: "/sell",
        loader: requireAuth,
        children: [
          {
            path: "",
            element: <Sell />,
          },
          {
            path: "mylist",
            element: <MyList />,
          },
        ],
      },
      {
        path: "/guide",
        element: <Guide />,
      },
      {
        path: "/mypage",
        element: <Mypage />,
        loader: requireAuth,
        children: [
          {
            path: "",
            element: <Mypage />,
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
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
