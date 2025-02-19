import { findCategory } from "../../modules/category";
import { CommonCategoryBadgeStyle } from "../../styles/CommonStyle";

export default function CommonCategoryBadge({
  categoryID,
}: {
  categoryID: number;
}) {
  return (
    <CommonCategoryBadgeStyle>
      <div className="category_badge">{findCategory(categoryID)}</div>
    </CommonCategoryBadgeStyle>
  );
}
