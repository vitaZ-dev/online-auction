import { Pagination, Stack } from "@mui/material";
import { MUIPaginationProps } from "../../types/component";

export default function MUIPagination({
  totalPage,
  setPage,
}: MUIPaginationProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
        marginTop: "6px",
      }}
    >
      <Stack spacing={2}>
        <Pagination
          count={totalPage}
          variant="outlined"
          color="secondary"
          onChange={(_, changePage) => setPage(changePage)}
        />
      </Stack>
    </div>
  );
}
