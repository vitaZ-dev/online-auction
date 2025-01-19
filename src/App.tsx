import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BaseLayout,
  FooterLayout,
  HeaderLayout,
  light,
  MainLayout,
} from "./styles/AppStyle";

// import Drawer from "@mui/material/Drawer";
import { Global } from "@emotion/react";
import useAuthStore from "./stores/useAuthStore";
import {
  Box,
  Collapse,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import List from "@mui/material/List";

function App() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const [toggleMenu, setToggleMenu] = useState(false);
  const handleToggleMenu = () => setToggleMenu(!toggleMenu);

  const { userInfo, loginCheck, logout } = useAuthStore();

  const handelLogout = () => {
    logout();
    alert("logout");
    location.href = "/";
  };

  return (
    <>
      <Global styles={light} />
      <BaseLayout>
        <HeaderLayout>
          <h1>
            <NavLink to="/" onClick={toggleDrawer(false)}>
              <img src="/images/logo.svg" alt="logo" />
            </NavLink>
          </h1>
          <div className="header_utils">
            <button onClick={() => console.log("search")}>
              <img src="/images/search.svg" alt="search" />
            </button>
            <button onClick={toggleDrawer(true)}>
              <img src="/images/nav.svg" alt="nav" />
            </button>
            <SwipeableDrawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
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
                {loginCheck || (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "text-lime-500" : "text-white"
                      }
                      onClick={toggleDrawer(false)}
                    >
                      login
                    </NavLink>
                  </li>
                )}
                {loginCheck && (
                  <li>
                    <button
                      onClick={handelLogout}
                      style={{ border: "2px solid red" }}
                    >
                      logout
                    </button>
                  </li>
                )}
              </ul>
              <Box>
                <Divider />
                {loginCheck && <div>어서오세요, {userInfo?.nickname} 님!</div>}
                <Divider />
                {/* https://mui.com/material-ui/react-drawer/#toolpad-beta */}
                <List component="nav">
                  {["All mail", "Trash", "Spam"].map((text) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/auction"
                        onClick={toggleDrawer(false)}
                      >
                        경매
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider />

                <List component="nav">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu}>
                      <span>toggle</span>
                      {/* {open ? <ExpandLess /> : <ExpandMore />} */}
                    </ListItemButton>
                  </ListItem>
                </List>
                <Collapse in={toggleMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary="Starred" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </Box>
            </SwipeableDrawer>
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
    </>
  );
}

export default App;
