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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

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

  const { userInfo, isLogin, logout } = useAuthStore();

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
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <NavLink to="/" onClick={toggleDrawer(false)}>
                      <img src="/images/logo.svg" alt="logo" />
                    </NavLink>
                    <div onClick={toggleDrawer(false)}>
                      <CloseIcon />
                    </div>
                  </div>
                </div>
                <Divider />
                {/* https://mui.com/material-ui/react-drawer/#toolpad-beta */}
                <List component="nav">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu}>
                      <ListItemText primary="경매" />
                      {toggleMenu ? <ExpandLess /> : <ExpandMore />}
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
                      <ListItemText primary="판매" />
                      {toggleMenu2 ? <ExpandLess /> : <ExpandMore />}
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
                      <ListItemText primary="about/service" />
                      {toggleMenu3 ? <ExpandLess /> : <ExpandMore />}
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
                {isLogin && (
                  <ListItem disablePadding>
                    <ListItemButton>
                      <NavLink
                        to="/mypage"
                        onClick={toggleDrawer(false)}
                        style={{ flex: "1 1 auto" }}
                      >
                        <ListItemText primary="mypage →" />
                      </NavLink>
                      <CallMadeIcon />
                    </ListItemButton>
                  </ListItem>
                )}

                <div>
                  <Divider />
                  <div
                    style={{
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AccountCircleIcon />
                    {isLogin ? (
                      <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "16px" }}>
                          어서오세요, {userInfo?.nickname} 님!
                        </div>
                        <div>
                          <button
                            onClick={handelLogout}
                            style={{ border: "2px solid red" }}
                          >
                            logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <NavLink to="/login" onClick={toggleDrawer(false)}>
                          로그인
                        </NavLink>
                        <NavLink
                          to="/login/register"
                          onClick={toggleDrawer(false)}
                        >
                          회원가입
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
                {/* <div style={{ padding: "12px" }}>
                  {isLogin || (
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
                  {isLogin && (
                    <div>
                      <button
                        onClick={handelLogout}
                        style={{ border: "2px solid red" }}
                      >
                        logout
                      </button>
                    </div>
                  )}
                </div> */}
              </Box>
            </SwipeableDrawer>
          </div>
        </HeaderLayout>
        <MainLayout>
          <Outlet />
        </MainLayout>
        <FooterLayout>
          <div
          // style={{
          //   display: "flex",
          //   alignItems: "center",
          //   justifyContent: "space-between",
          // }}
          >
            <span>Copyrightⓒ 2025. XX. All rights reserved.</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // justifyContent: "space-between",
                gap: 8,
              }}
            >
              <GitHubIcon />
              <GitHubIcon />
              <MailOutlineIcon />
            </div>
          </div>
        </FooterLayout>
      </BaseLayout>
    </>
  );
}

export default App;
