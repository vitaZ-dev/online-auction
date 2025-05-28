/* eslint-disable @typescript-eslint/no-explicit-any */
import useCounterStore from "../../stores/useCounterStore.js";
// import { useQuery } from "react-query";
import firebaseDB from "../../libs/firebase.js";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import CommonTitle from "../../components/UI/CommonTitle.js";
import CommonList from "../../components/UI/CommonList.js";
import { Link } from "react-router-dom";
import CommonListItem from "../../components/UI/CommonListItem.js";
import { findCategory } from "../../constants/category.js";
import MUIPagination from "../../components/common/MUIPagination.js";
import { setDateTemp, setTimestampDate } from "../../modules/index.js";
import api from "../../apis/api.js";
import { calTotalPage } from "../../utils/index.js";

export default function About() {
  const { count, increase, decrease } = useCounterStore();

  const [db, setDB] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    // getFirebasaeData();
    // firebaseAxios();
  }, []);

  useEffect(() => {
    getJsonServerData(page);
  }, [page]);

  const getJsonServerData = async (page: number) => {
    try {
      const { data, headers } = await api.get(
        `posts?_sort=created_at&_order=desc&_page=${page}&_limit=4`
      );
      setTotalPage(calTotalPage(headers[`x-total-count`], 4));
      console.log(data, headers[`x-total-count`]);
      setDB(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFirebasaeData = async () => {
    try {
      // const docRef = doc(firebaseDB, "todos", "uybADblZjRO7XgoDE7o3");
      // const docSnap = await getDoc(docRef);

      const categoryRef = query(collection(firebaseDB, "todos")); //, limit(2));
      const queryCategory = await getDocs(categoryRef);
      console.log(queryCategory);
      setDB(queryCategory.docs);

      const totalPageCal =
        queryCategory.size > 16 ? Math.ceil(+queryCategory.size / 16) : 1;
      setTotalPage(totalPageCal);
      queryCategory.docs.forEach((item) => {
        console.log(item.data());
        // console.log(item.data().created_at.toDate());
        const day = item.data().created_at.toDate();
        // const year = day.getFullYear();
        // const month = ("0" + (day.getMonth() + 1)).slice(-2);
        // const days = ("0" + day.getDate()).slice(-2);
        // console.log("", year + month + days);
        console.log("setTimestampDate", setTimestampDate(day));
        // setDateTemp 20250324
      });

      // const q = query(
      //   collection(firebaseDB, "todos"),
      //   where("capital", "==", false)
      // );

      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      // });

      // if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      // } else {
      //   // docSnap.data() will be undefined in this case
      //   console.log("No such document!");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // const firebaseAxios = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://firestore.googleapis.com/v1/projects/online-auction/databases/(default)/documents/online-auction`
  //     );
  //     console.log("Document added: ", response.data);
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };
  /*
  const { isLoading, data, isError, error } = useQuery(
    "get-product",
    () => {
      // const { data } = useQuery("get-product", () => {
      return axios.get("http://localhost:4000/posts");
    },
    { staleTime: 30000, refetchOnMount: "always", refetchOnWindowFocus: false }
  );
  // console.log(data);
  console.log(isLoading, data, isError, error);
  */

  // const options = {
  //   root: null, // .scroll-container 엘리먼트를 root로 설정. null일 경우 브라우저 viewport
  //   rootMargin: "0px", // rootMargin을 '10px 10px 10px 10px'로 설정
  //   threshold: [0, 0.5, 1], // 타겟 엘리먼트가 교차영역에 진입했을 때, 교차영역에 타켓 엘리먼트의 50%가 있을 때, 교차 영역에 타켓 엘리먼트의 100%가 있을 때 observe가 반응한다.
  // };
  // const callback = (entries, observer) => {
  //   console.log("hi", entries, observer);
  // };
  // const observer = new IntersectionObserver(callback, options);
  // // const listEnd = document.querySelector(".scroll-end") as Element;
  // // const ref = useRef(null);
  // const [ref, setRef] = useState<null | HTMLDivElement>(null);
  // observer.observe(ref);
  return (
    <>
      <div>
        <h1>{count}</h1>
        <button onClick={increase}>Increase</button>
        <button onClick={decrease}>Decrease</button>
      </div>

      <hr />
      <div className="scroll-container"></div>
      <hr />

      {/* <CommonTitle type={1} title="firebase data loading test" /> */}
      <CommonList>
        {db?.map((post, idx) => {
          return (
            <div key={idx}>
              <p>{post.title}</p>
              {/* <p>{post.data().title}</p>
              <p>{setTimestampDate(post.data().created_at.toDate())}</p> */}
            </div>
          );
        })}
        {/* {db?.map((post, idx) => {
          return (
            <Link to={`${post.data().id}`} key={idx}>
              <CommonListItem
                src={post.data().src}
                category={findCategory(post.data()?.category_id)}
                title={post.data().title}
                startPrice={post.data().start_price}
              />
            </Link>
          );
        })} */}
      </CommonList>
      {/* <div style={{ height: 1000 }}></div> */}
      {/* <div ref={ref} className="scroll-end"></div> */}
      <MUIPagination totalPage={totalPage} setPage={setPage} />
      <div style={{ display: "none" }}>
        <h1>경매 안내</h1>
        <p>온라인 경매 사이트입니다. 개인 물품을 올려 경매하는 사이트입니다.</p>
        <div>
          <div>
            step 1 <br />
            회원가입
          </div>
          <p>
            온라인 옥션션 온라인 경매는 홈페이지에서 회원 가입 후 경매 전 인증을
            마치면 누구나 참여 가능합니다.
          </p>
        </div>
        <div>
          <div>
            step 2 <br />
            응찰 방법
          </div>
          <p>- 기간 동안 입찰 가능</p>
        </div>
        <div>
          <div>
            step 3 <br />
            응찰 방법
          </div>
          <p>- 기간 동안 입찰 가능</p>
        </div>
      </div>
    </>
  );
}
