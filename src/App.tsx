import { Outlet } from "react-router-dom";
import { BaseLayout, HeaderLayout, MainLayout } from "./styles/AppStyle";

function App() {
  return (
    <BaseLayout>
      <HeaderLayout>
        <h1>logo</h1>
        <div className="header-utils">
          <button onClick={() => console.log("search")}>
            <img src="/images/search.svg" alt="search" />
          </button>
          <button onClick={() => console.log("nav")}>
            <img src="/images/nav.svg" alt="nav" />
          </button>
        </div>
      </HeaderLayout>
      <MainLayout>
        <Outlet />
      </MainLayout>
      <footer>footer</footer>
    </BaseLayout>
  );
}

export default App;
