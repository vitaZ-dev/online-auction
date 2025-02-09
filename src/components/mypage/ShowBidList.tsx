export default function ShowBidList() {
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
          detail contents
        </div>
      </div>
    </div>
  );
}
