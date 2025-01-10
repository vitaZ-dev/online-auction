import { Outlet } from "react-router-dom";

export default function Container() {
  return (
    <div style={{ margin: "0 auto", maxWidth: "640px" }}>
      <header>
        <div className="d-flex" style={{ height: "50%" }}>
          <h1>title</h1>
          <button
            onClick={() => console.log("click")}
            style={{ height: "100%" }}
          >
            <img src="/images/bar.svg" className="logo" alt="Vite logo" />
          </button>
        </div>
        <div>
          <input
            className="w-100"
            type="text"
            placeholder="검색어를 입력하세요"
          />
          <div>검색 키워드</div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}
