import { Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Typography, TextField, MenuItem, Pagination } from "@mui/material";
import { httpService } from "../httpService";

export default function MyPagination({ rootPath, setResults, setStartIndex }) {
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [allResultsLength, setAllResultsLength] = useState(0);

  const getData = async () => {
    const { data } = await httpService(
      `${rootPath}page=${page}&limit=${limit}`
    );

    if (data) {
      setResults(data.results);
      setStartIndex(data.startIndex);

      setAllResultsLength(data.allResultsLength);
    }
  };

  const getDat2 = async (_page, _limit) => {
    setFetching(true);
    const { data } = await httpService(
      `${rootPath}page=${_page}&limit=${_limit}`
    );

    if (data) {
      setResults(data.results);
      setStartIndex(data.startIndex);

      setAllResultsLength(data.allResultsLength);
    }
    setFetching(false);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="mt-2">
      <div className="d-flex justify-content-end">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <div className="d-flex align-items-center">
            {fetching ? <Spinner size="sm" animation="border" /> : null}
          </div>
          <div className="d-flex align-items-center">
            <Typography variant="caption">Rows per page</Typography>
            <TextField
              value={limit}
              select
              variant="standard"
              className="ms-2"
              onChange={(e) => {
                setLimit(e.target.value);
                getDat2(page, e.target.value);
              }}
            >
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={150}>150</MenuItem>
              <MenuItem value={200}>200</MenuItem>
            </TextField>
          </div>
          <div className="d-flex align-items-center">
            <Typography variant="caption">Page: {page}</Typography>
          </div>
          <Pagination
            count={Math.ceil(allResultsLength / limit)}
            onClick={(e) => {
              setPage(e.target.textContent);
              getDat2(e.target.textContent, limit);
            }}
            showFirstButton
            showLastButton
          />
        </Stack>
      </div>
    </div>
  );
}
