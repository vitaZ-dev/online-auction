import { useEffect } from "react";
import { FullImageLayout } from "../../styles/AuctionStyle";
import { FullSizeImageProps } from "../../types/component";

export default function FullSizeImage({ src, setShow }: FullSizeImageProps) {
  useEffect(() => {
    setShow(true);
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
