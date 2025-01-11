import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BaseLayout,
  FooterLayout,
  HeaderLayout,
  MainLayout,
} from "./styles/AppStyle";

import Drawer from "@mui/material/Drawer";

function App() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <BaseLayout>
      <HeaderLayout>
        <h1>
          <NavLink to="/" onClick={toggleDrawer(false)}>
            <img src="/images/logo.svg" alt="logo" />
          </NavLink>
        </h1>
        <div className="header-utils">
          <button onClick={() => console.log("search")}>
            <img src="/images/search.svg" alt="search" />
          </button>
          <button onClick={toggleDrawer(true)}>
            <img src="/images/nav.svg" alt="nav" />
          </button>
          <Drawer
            anchor="top"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                maxWidth: "640px", // 원하는 최대 너비 설정
                margin: "0 auto",
                overflowY: "visible",
              },
            }}
          >
            <ul>
              <li>
                <NavLink
                  to="/auction"
                  className={({ isActive }) =>
                    isActive ? "text-lime-500" : "text-white"
                  }
                  onClick={toggleDrawer(false)}
                >
                  경매
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sell"
                  className={({ isActive }) =>
                    isActive ? "text-lime-500" : "text-white"
                  }
                  onClick={toggleDrawer(false)}
                >
                  판매
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mypage"
                  className={({ isActive }) =>
                    isActive ? "text-lime-500" : "text-white"
                  }
                  onClick={toggleDrawer(false)}
                >
                  mypage
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "text-lime-500" : "text-white"
                  }
                  onClick={toggleDrawer(false)}
                >
                  about
                </NavLink>
              </li>
            </ul>
          </Drawer>
        </div>
      </HeaderLayout>
      <MainLayout>
        <Outlet />
      </MainLayout>
      <FooterLayout>
        <div style={{}}>
          <img src="/images/logo.svg" alt="logo" />
          <span>Copyrightⓒ2025 XX All rights reserved.</span>
        </div>
      </FooterLayout>
    </BaseLayout>
  );
}

export default App;
