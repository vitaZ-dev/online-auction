import { useEffect } from "react";
import { FullImageLayout } from "../../styles/AuctionStyle";

export default function FullSizeImage({ src, setShow }) {
  useEffect(() => {
    setShow(true);
    console.log("src", src);
  }, [src]);

  const closeComponent = () => setShow(false);

  return (
    <FullImageLayout>
      <div className="wrap_box">
        <button onClick={closeComponent}>X</button>
        <div className="image_wrap">
          <img src={src} alt="image" />
        </div>
      </div>
    </FullImageLayout>
  );
}
