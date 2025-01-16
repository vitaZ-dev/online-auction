import { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { setDate30Temp, setDateTemp } from "../../modules";

export default function Sell() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState(0); //start_price

  const { userInfo } = useAuthStore();

  // const navigate = useNavigate();

  const registerPost = () => {
    const start_date = setDateTemp();
    const end_date = setDate30Temp(start_date);

    try {
      axios.post("http://localhost:4000/posts", {
        title,
        category,
        user_info: userInfo?.nickname || "USER",
        start_date,
        end_date,
        price: 9999,
        start_price: price,
        now_price: 0,
        status: true,
        src: "https://placehold.co/100x100",
        contents,
        bid: 0,
      });
      alert("ok");
      // navigate("/login");
    } catch (err) {
      console.log(err);
      alert("error 발생-등록 실패");
    }
  };

  return (
    <>
      <h1>Sell</h1>

      <form className="login-form" onSubmit={() => registerPost()}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <label htmlFor="contents">내용</label>
        <textarea
          id="contents"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        ></textarea>

        <br />
        <br />

        <label htmlFor="category">카테고리</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br />
        <br />

        <label htmlFor="price">시작가</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </form>
      <br />
      <button
        onClick={() => registerPost()}
        style={{ width: "100%", border: "1px solid silver", padding: "12px" }}
      >
        등록하기
      </button>
    </>
  );
}
