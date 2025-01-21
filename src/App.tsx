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
    setToggleMenu(false);
    setToggleMenu2(false);
    setToggleMenu3(false);
  };
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleMenu2, setToggleMenu2] = useState(false);
  const [toggleMenu3, setToggleMenu3] = useState(false);
  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
    setToggleMenu2(false);
    setToggleMenu3(false);
  };
  const handleToggleMenu2 = () => {
    setToggleMenu(false);
    setToggleMenu2(!toggleMenu2);
    setToggleMenu3(false);
  };
  const handleToggleMenu3 = () => {
    setToggleMenu(false);
    setToggleMenu2(false);
    setToggleMenu3(!toggleMenu3);
  };

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
              <Box>
                <Divider />
                <div>
                  {loginCheck && (
                    <div style={{ padding: "12px" }}>
                      어서오세요, {userInfo?.nickname} 님!
                    </div>
                  )}
                </div>
                <Divider />
                {/* https://mui.com/material-ui/react-drawer/#toolpad-beta */}
                <List component="nav">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu}>
                      <span>경매 !</span>
                      {/* {open ? <ExpandLess /> : <ExpandMore />} */}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/auction"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        경매 물품
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/about"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        경매 안내
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu2}>
                      <span>판매 !</span>
                      {/* {open ? <ExpandLess /> : <ExpandMore />} */}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu2} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/sell"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        경매 출품
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/mypage/list"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        출품 목록
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu3}>
                      <span>about/service !</span>
                      {/* {open ? <ExpandLess /> : <ExpandMore />} */}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu3} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/about"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        회사 소개
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/about"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        서비스 소개
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/about"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 4 }}
                      >
                        공지사항
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
                <Divider />
                <div style={{ padding: "12px" }}>
                  {loginCheck ? (
                    <div
                      style={{
                        marginBottom: "6px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <p>어서오세요, {userInfo?.nickname} 님!</p>
                      <div>
                        <NavLink
                          to="/mypage"
                          className={({ isActive }) =>
                            isActive ? "text-lime-500" : "text-white"
                          }
                          onClick={toggleDrawer(false)}
                        >
                          mypage →
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {loginCheck || (
                    <div>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive ? "text-lime-500" : "text-white"
                        }
                        onClick={toggleDrawer(false)}
                      >
                        login
                      </NavLink>
                    </div>
                  )}
                  {loginCheck && (
                    <div>
                      <button
                        onClick={handelLogout}
                        style={{ border: "2px solid red" }}
                      >
                        logout
                      </button>
                    </div>
                  )}
                </div>
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
