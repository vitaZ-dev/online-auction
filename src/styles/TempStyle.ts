import styled from "@emotion/styled";

export const ShowListTableLayout = styled.div`
  position: relative;

  .table_header,
  .table_contents > * {
    display: grid;
    grid-template-columns: ${({ tableGrid }) =>
      tableGrid.map((grid) => `${grid}fr`).join(" ")};

    line-height: 2;
  }

  .table_header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid var(--main-red-color);
    span {
      padding: 0 8px;
    }
  }

  .table_contents {
    max-height: 70vh;
    overflow-y: auto;
    span {
      padding: 0 8px;
    }
  }
`;
