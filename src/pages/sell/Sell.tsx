import { useState } from "react";
import api from "../../apis/api";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { setDate14Temp, setDateTemp } from "../../modules";
import { CATEGORY } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import { WritepageLayout } from "../../styles/SellPageStyle";
import CommonInput from "../../components/common/CommonInput";
import CommonTextarea from "../../components/common/CommonTextarea";

export default function Sell() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(-1);
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState(0); //start_price
  const [imgSrc, setImgSrc] = useState("");

  const { userInfo, updateSalesHistory } = useAuthStore();
  const navigate = useNavigate();

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = ((e.target as HTMLInputElement)?.files as FileList)[0];

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

  const registerPost = () => {
    if (!title) {
      alert("제목을 입력하세요!");
      return false;
    }
    if (!contents) {
      alert("내용을 입력하세요!");
      return false;
    }
    if (category === -1) {
      alert("카테고리를 선택하세요!");
      return false;
    }
    if (!imgSrc) {
      alert("이미지를 선택하세요!");
      return false;
    }

    const start_price = Math.abs(Number(price));
    const start_date = setDateTemp();
    const end_date = setDate14Temp(start_date);

    try {
      api.post("posts", {
        title,
        category_id: category,
        user_info: userInfo?.nickname || "USER",
        user_id: userInfo?.uuid,
        start_date,
        end_date,
        price: 9999,
        start_price,
        now_price: 0,
        is_open: 1,
        src: imgSrc,
        contents,
        created_at: start_date,
        favorite: 1,
        favorite_list: [],
        bid: 0,
        cnt: 0,
        bid_count: 0,
        bid_history: [],
      });
      updateSalesHistory(null);
      alert("ok");
      navigate("/auction");
    } catch (err) {
      console.log(err);
      alert("error 발생-등록 실패");
    }
  };

  return (
    <WritepageLayout>
      <CommonTitle type={1} title="경매 출품 게시글 작성" />

      <div className="write_area">
        <div>
          <div className="item_img">
            <div className="img_wrap">
              {imgSrc ? (
                <img src={imgSrc} />
              ) : (
                <label htmlFor="imgfile" className="img_notice">
                  이미지를
                  <br />
                  선택해주세요
                </label>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            id="imgfile"
            onChange={(e) => onChangeFile(e)}
            style={{ display: "none" }}
          />
          <label htmlFor="imgfile" className="img_btn">
            파일선택
          </label>
        </div>

        <div>
          <label htmlFor="title">제목</label>
          <CommonInput
            type="text"
            id="title"
            value={title}
            setValue={(e) => setTitle(e.target.value)}
            length="full"
            maxLength={50}
            placeholder="제목을 입력해주세요"
          />
          <span className="text_length">{title.length}/50</span>
        </div>

        <div>
          <label htmlFor="contents">내용</label>
          <CommonTextarea
            id="contents"
            value={contents}
            setValue={(e) => setContents(e.target.value)}
            maxLength={1000}
            placeholder="내용을 입력해주세요"
          />
          <span className="text_length">{contents.length}/1000</span>
        </div>

        <div className="flex_seperate">
          <div>
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
          </div>
          <div>
            <label htmlFor="price">시작가</label>
            <CommonInput
              id="price"
              type="number"
              value={price}
              setValue={(e) => setPrice(Number(e.target.value))}
              min={0}
              placeholder="시작가"
            />
          </div>
        </div>

        <button className="page_btn" onClick={() => registerPost()}>
          등록하기
        </button>
      </div>
    </WritepageLayout>
  );
}
