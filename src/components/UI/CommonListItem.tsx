import { numberFormat } from "../../utils";

export default function CommonListItem({
  src,
  category,
  title,
  startPrice,
  isOpen = true,
}: {
  src: string;
  category: string;
  title: string;
  startPrice: string | number;
  isOpen?: boolean;
}) {
  // jsx
  return (
    <article>
      <div className="post_img">
        <div className="img_wrap">
          <img src={src} alt="img" />
        </div>
        {!isOpen && <span className="closed">마감</span>}
      </div>
      <div className="post_info">
        <div className="category_badge">{category}</div>
        <h5 className="ellipsis-1">{title}</h5>
        <p className="ellipsis-1">{numberFormat(startPrice)}원 ~</p>
      </div>
    </article>
  );
}
