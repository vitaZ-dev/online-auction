/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";

export default function ShowBidList({ title, contents, setToggle }: any) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#4b44449e",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          width: "100%",
          maxWidth: "640px",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "500px",
            background: "white",
          }}
        >
          <p style={{ marginBottom: "16px" }}>{title}</p>
          <div className="scroll">
            {contents?.map((item: any, idx: number) => (
              <div key={`${item.id}_${idx}`}>
                <p>
                  {item.amount}원 / 시간={item.time}
                </p>
              </div>
            ))}
          </div>
          <button onClick={() => setToggle(false)}>닫기</button>
          <button onClick={() => navigate(`/auction/${contents[0].id}`)}>
            게시글
          </button>
        </div>
      </div>
    </div>
  );
}
