import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { setDate30Temp, setDateTemp } from "../../modules";
import { CATEGORY } from "../../modules/category";

export default function Sell() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(-1);
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState(0); //start_price
  const [imgSrc, setImgSrc] = useState("");

  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  const onChangeFile = (e: Event) => {
    const file = e.target?.files[0];
    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const str = e?.currentTarget?.result;

        setImgSrc(str);
      };
      reader.readAsDataURL(file);
      // end
    }
  };

  const registerPost = () => {
    if (!title) {
      alert("제목을 입력하세요!");
      return false;
    }
    if (!category) {
      alert("내용을 입력하세요!");
      return false;
    }
    if (!contents) {
      alert("카테고리를 선택하세요!");
      return false;
    }
    const start_price = Math.abs(Number(price));

    const start_date = setDateTemp();
    const end_date = setDate30Temp(start_date);

    try {
      axios.post("http://localhost:4000/posts", {
        title,
        category_id: category,
        user_info: userInfo?.nickname || "USER",
        user_id: userInfo?.uuid,
        start_date,
        end_date,
        price: 9999,
        start_price,
        now_price: 0,
        status: true,
        src: [imgSrc],
        contents,
        bid: 0,
        created_at: new Date(),
      });
      alert("ok");
      navigate("/auction");
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
          maxLength={50}
        />
        <span>{title.length}/50</span>

        <br />
        <br />

        <label htmlFor="contents">내용</label>
        <textarea
          id="contents"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          style={{ width: "100%", height: "100px" }}
          maxLength={1000}
        ></textarea>
        <span>{contents.length}/1000</span>

        <br />
        <br />
        <label htmlFor="imgfile">이미지</label>
        <input
          type="file"
          accept="image/*"
          id="imgfile"
          onChange={(e) => onChangeFile(e)}
        />
        <img src={imgSrc} width="100" height="100" />

        <br />
        <br />

        <label htmlFor="category">카테고리</label>
        <select
          name="category"
          id="category"
          onChange={(e) => setCategory(Number(e.target.value))}
          value={category}
        >
          <option value={-1} disabled>
            카테고리
          </option>
          {CATEGORY.map((cate) => (
            <option value={cate.category_id} key={cate.category_id}>
              {cate.category_name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label htmlFor="price">시작가</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
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
