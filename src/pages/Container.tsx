import { Outlet } from "react-router-dom";

export default function Container() {
  return (
    <>
      <header>header</header>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
}
