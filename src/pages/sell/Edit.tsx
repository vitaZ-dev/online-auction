import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { CATEGORY } from "../../modules/category";

export default function Edit() {
  const [pageCheck, setPageCheck] = useState(true);
  const [userCheck, setUserCheck] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(-1);
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState(0); //start_price
  const [imgSrc, setImgSrc] = useState("");

  const { pathname } = useLocation();
  const POST_ID = pathname.split("/")[2];
  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?id=${POST_ID}`
      );
      setPageCheck(Boolean(data.length));
      setUserCheck(data[0]?.user_id === userInfo?.uuid);
      console.log(data);
      // 내용세팅
      setTitle(data[0]?.title);
      setContents(data[0]?.contents);
      setImgSrc(data[0]?.src);
      setCategory(data[0]?.category_id ?? -1);
      setPrice(data[0]?.start_price);
    };

    fetchPosts();
  }, []);

  const onChangeFile = (e: Event) => {
    const file = e.target?.files[0];

    if (
      !["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
        file.type
      )
    ) {
      alert("이미지를 선택해주세요");
      return false;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // canvas.width = document.getElementById("imgfile")
          //   ?.offsetWidth as number;
          // canvas.height = document.getElementById("imgfile")
          //   ?.offsetHeight as number;

          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          // 비율에 맞게 크기 조정
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Canvas 크기 설정
          canvas.width = width;
          canvas.height = height;

          // 이미지 그리기
          ctx?.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL("image/webp");
          setImgSrc(base64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const editPost = async () => {
    const start_price = Math.abs(Number(price));

    try {
      await axios.patch(`http://localhost:4000/posts/${POST_ID}`, {
        title,
        category_id: category,
        contents,
        start_price,
        src: imgSrc,
      });
      alert("게시글이 수정되었습니다!");
      navigate("/auction");
    } catch (error) {
      console.log(error);
      alert("게시글 수정에 실패했습니다!");
    }
  };

  return (
    <>
      {pageCheck ? (
        userCheck ? (
          <div>
            <h1>게시글 수정</h1>
            <form className="login-form" onSubmit={() => editPost()}>
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
              <img src={imgSrc} alt="preview_file" />

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
              onClick={() => editPost()}
              style={{
                width: "100%",
                border: "1px solid silver",
                padding: "12px",
              }}
            >
              수정하기
            </button>
          </div>
        ) : (
          <div>해당 게시글에 접근 권한이 없습니다</div>
        )
      ) : (
        <div>페이지를 찾을 수 없어요</div>
      )}
    </>
  );
}
