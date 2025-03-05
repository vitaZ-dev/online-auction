import useCounterStore from "../stores/useCounterStore";
// import { useQuery } from "react-query";
// import axios from "axios";

export default function About() {
  const { count, increase, decrease } = useCounterStore();

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

  return (
    <>
      <div>
        <h1>{count}</h1>
        <button onClick={increase}>Increase</button>
        <button onClick={decrease}>Decrease</button>
      </div>

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
    </>
  );
}
