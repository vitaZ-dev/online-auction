import { ShowListTableLayout } from "../styles/TempStyle";
import { ShowListTableProps } from "../types/component";
import { numberFormat } from "../utils";

export default function ShowListTable({
  tableGrid,
  tableHeader,
  tableHeaderText,
  tableList,
}: ShowListTableProps) {
  return (
    <ShowListTableLayout tableGrid={tableGrid}>
      <div className="table_header">
        {tableHeader?.map((_, idx) => (
          <span key={`table_header_${idx}`}>{tableHeaderText[idx]}</span>
        ))}
      </div>
      <div className="table_contents">
        {tableList?.map((list, idx) => (
          <p key={`table_list_${idx}`}>
            {Array(tableHeader.length)
              .fill(0)
              .map((_, index) => (
                <span key={`table_list_${idx}_${index}`}>
                  {Number.isInteger(list[tableHeader[index]])
                    ? numberFormat(list[tableHeader[index]])
                    : list[tableHeader[index]]}
                </span>
              ))}
          </p>
        ))}
      </div>
    </ShowListTableLayout>
  );
}
