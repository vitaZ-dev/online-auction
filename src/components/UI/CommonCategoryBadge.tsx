import { findCategory } from "../../constants/category";
import { CommonCategoryBadgeStyle } from "../../styles/CommonStyle";
import { CommonCategoryBadgeProps } from "../../types/component";

export default function CommonCategoryBadge({
  categoryID,
}: CommonCategoryBadgeProps) {
  return (
    <CommonCategoryBadgeStyle>
      <div className="category_badge">{findCategory(categoryID)}</div>
    </CommonCategoryBadgeStyle>
  );
}
