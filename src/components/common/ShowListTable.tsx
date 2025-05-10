import { ShowListTableLayout } from "../../styles/CommonStyle";
import { ShowListTableProps } from "../../types/component";
import { numberFormat } from "../../utils";
import DataLoading from "../UI/DataLoading";

export default function ShowListTable({
  tableGrid,
  tableHeader,
  tableHeaderText,
  tableList,
  tableLoading = false,
}: ShowListTableProps) {
  // loading
  if (tableLoading)
    return (
      <ShowListTableLayout tableGrid={tableGrid}>
        <div className="table_header">
          {tableHeader?.map((_, idx) => (
            <span key={`table_header_${idx}`}>{tableHeaderText[idx]}</span>
          ))}
        </div>
        <DataLoading />
        <div className="mb32"></div>
      </ShowListTableLayout>
    );

  return (
    <ShowListTableLayout tableGrid={tableGrid}>
      <div className="table_header">
        {tableHeader?.map((_, idx) => (
          <span key={`table_header_${idx}`}>{tableHeaderText[idx]}</span>
        ))}
      </div>
      <div className="table_contents">
        {tableList?.length ? (
          <>
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
          </>
        ) : (
          <p className="no_contents">기록이 없습니다.</p>
        )}
      </div>
    </ShowListTableLayout>
  );
}
