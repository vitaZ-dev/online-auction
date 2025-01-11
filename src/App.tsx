import { useState } from "react";
import { Outlet } from "react-router-dom";
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
          <img src="/images/logo.svg" alt="logo" />
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            provident ipsam consequatur eaque? Nobis, ducimus quas, rem non sunt
            dolorum, ab facilis molestias at animi libero ratione eum! Possimus,
            perspiciatis?
            <br />
            <hr />
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem
            libero, quisquam incidunt quia voluptates aspernatur veritatis
            numquam cum quaerat quo voluptatum doloremque quasi perspiciatis
            aliquid veniam mollitia quos doloribus eos!
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
