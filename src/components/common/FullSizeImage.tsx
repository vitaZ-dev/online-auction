import { useEffect } from "react";
import { FullImageLayout } from "../../styles/CommonStyle";
import { FullSizeImageProps } from "../../types/component";
import CloseIcon from "@mui/icons-material/Close";

export default function FullSizeImage({ src, setShow }: FullSizeImageProps) {
  useEffect(() => {
    setShow(true);
  }, [src]);

  const closeComponent = () => setShow(false);

  return (
    <FullImageLayout>
      <div className="wrap_box">
        <button className="close_btn" onClick={closeComponent}>
          <CloseIcon />
        </button>
        <div className="image_wrap">
          <img src={src} alt="image" />
        </div>
      </div>
    </FullImageLayout>
  );
}
