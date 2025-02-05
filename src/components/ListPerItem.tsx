export default function ListPerItem({
  src,
  category,
  title,
  contents,
}: {
  src: string;
  category: string;
  title: string;
  contents: string;
}) {
  // jsx
  return (
    <article>
      <div className="post_img">
        <div className="img_wrap">
          <img src={src} alt="img" />
        </div>
      </div>
      <div className="post_info">
        <div className="category_badge">{category}</div>
        <h5 className="ellipsis-1">{title}</h5>
        <p className="ellipsis-1">{contents}</p>
      </div>
    </article>
  );
}
