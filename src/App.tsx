import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CommonButton from "./components/common/CommonButton";
import Logo from "./components/Logo";
import { auth } from "./libs/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import queryClient from "./libs/queryClient";

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

  const navigate = useNavigate();
  const { loginStatus, userInfo, isLogin, logout, updateUserInfo } =
    useAuthStore();
  const location = useLocation();

  const handelLogout = async () => {
    try {
      toggleDrawer(false);
      await signOut(auth);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "mypage",
      });
      queryClient.getQueryCache().clear();
      alert("로그아웃 되었습니다.");
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (!user) {
        loginStatus(false);
        updateUserInfo(null);
      } else {
        loginStatus(true);
        updateUserInfo({
          email: user.email,
          id: user.uid,
          nickname: user.displayName,
          role: "USER",
          uuid: user.uid,
        });
      }
    });

    return () => unsubscribe();
  }, [loginStatus, updateUserInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Global styles={light} />
      <BaseLayout>
        <HeaderLayout>
          <h1>
            <Logo onClick={() => toggleDrawer(false)} />
          </h1>
          <div className="header_utils">
            {/* <button onClick={() => console.log("search")}>
              <img src="/images/search.svg" alt="search" />
            </button> */}
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
                  maxWidth: "640px",
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
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      height: "72px",
                    }}
                  >
                    <div onClick={toggleDrawer(false)}>
                      <Logo />
                    </div>
                    <div
                      onClick={toggleDrawer(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <CloseIcon />
                    </div>
                  </div>
                </div>
                <Divider />
                {/* https://mui.com/material-ui/react-drawer/#toolpad-beta */}
                <List component="nav">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu}>
                      <ListItemText primary="Auctions" />
                      {toggleMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/auction"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        경매 물품
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/guide"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        경매 안내
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu2}>
                      <ListItemText primary="Sell" />
                      {toggleMenu2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu2} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/sell"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        경매 출품
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/mypage/list"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        출품 목록
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleMenu3}>
                      <ListItemText primary="Services" />
                      {toggleMenu3 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={toggleMenu3} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/services"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        서비스 소개
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/services/faq"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
                      >
                        FAQ
                      </ListItemButton>
                      <ListItemButton
                        component={NavLink}
                        to="/services/notice"
                        onClick={toggleDrawer(false)}
                        sx={{ pl: 3 }}
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
                        <ListItemText primary="Mypage" />
                      </NavLink>
                      <CallMadeIcon />
                    </ListItemButton>
                  </ListItem>
                )}

                <div>
                  <Divider />
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AccountCircleIcon />
                    {isLogin ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div style={{ marginRight: "16px" }}>
                          어서오세요, {userInfo?.nickname} 님!
                        </div>
                        <div>
                          <CommonButton
                            text="로그아웃"
                            btnType="small"
                            onClick={handelLogout}
                          />
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
              </Box>
            </SwipeableDrawer>
          </div>
        </HeaderLayout>
        <MainLayout>
          <Outlet />
        </MainLayout>
        <FooterLayout>
          <div>
            <span>Copyrightⓒ 2025. vitaZ-dev. All rights reserved.</span>
            <div className="icons">
              <a
                href="https://orchid-carpet-4d1.notion.site/e5ee79b802ef4edfbc3e0f50dd1c944c"
                target="_blank"
              >
                <img
                  src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1570106347/noticon/hx52ypkqqdzjdvd8iaid.svg"
                  alt="notion"
                />
              </a>
              <a href="https://github.com/vitaZ-dev" target="_blank">
                <GitHubIcon />
              </a>
              <a href="mailto:@vitaminzdev@gmail.com">
                <MailOutlineIcon />
              </a>
            </div>
          </div>
        </FooterLayout>
      </BaseLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
