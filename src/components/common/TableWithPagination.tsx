import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, TableHead } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export type Props = {
  primaryKey?: string;
  headers?: string[];
  options: any[];
};

const TableWithPagination: React.FC<Props> = ({ primaryKey, headers = [], options = [] }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tableHeaders = headers?.length
    ? headers
    : Object.entries(options?.[0] ?? {}).map(([k]) => {
        return k;
      });
  return (
    <div>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((each) => {
                return <TableCell key={each}>{each}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? options.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : options).map(
              (row) => (
                <TableRow hover key={row.key}>
                  {Object.entries(row)
                    .filter((each) => each[0] !== (primaryKey ? primaryKey : 'key'))
                    .map(([key, value]) => {
                      return <TableCell key={key}>{value}</TableCell>;
                    })}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {options.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[Math.ceil(options.length / 4), Math.ceil(options.length / 2), options.length]}
          component="div"
          count={options.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(e, page) => setPage(page)}
          onChangeRowsPerPage={(e) => {
            const selectedRowsPerPage = parseInt(e.target.value);
            if (options.length >= selectedRowsPerPage * page) {
              setRowsPerPage(selectedRowsPerPage);
            }
          }}
          classes={{
            caption: classes.caption,
            selectIcon: classes.paginationSelectIcon,
            select: classes.paginationSelect,
          }}
          backIconButtonProps={{
            size: 'small',
          }}
          nextIconButtonProps={{
            size: 'small',
          }}
        />
      )}
    </div>
  );
};

export default TableWithPagination;

const useStyles = makeStyles(() => ({
  table: {
    border: '1px solid #eee',
  },
  caption: {
    color: '#000',
    padding: 8,
    fontSize: 14,
  },
  paginationSelectIcon: {
    marginTop: -5,
  },
  paginationSelect: {
    fontSize: 14,
  },
}));
