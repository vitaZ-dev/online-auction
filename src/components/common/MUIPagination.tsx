import { Pagination, Stack } from "@mui/material";

interface CommonPaginationProps {
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function MUIPagination({
  totalPage,
  setPage,
}: CommonPaginationProps) {
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
