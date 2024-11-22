import React, { useState, useEffect, useContext } from "react";
import "../styles/products.css";
import { fetchData } from "../hooks/apiManager";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ModalFormCustomers from "../components/formCustomers";

const columns = [
  { id: "customer_id", label: "Id", minWidth: 100 },
  { id: "name", label: "Nombre", minWidth: 170 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
  },
  {
    id: "phone",
    label: "Numero de telefono",
    minWidth: 170,
  },
  {
    id: "address",
    label: "Domicilio",
    minWidth: 170,
  },
];

function Customers() {
  const [Customers, setCustomers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setCustomers(await fetchData("/customers"));
    };

    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <div id="customers" className="d-flex m-2 bg-white border p-2 flex-column">
      <div className="d-flex  p-2 justify-content-between">
        <input type="text" placeholder="Search.." className="w-50" />
        <ModalFormCustomers />
      </div>

      <Paper
        sx={{ width: "100%", overflow: "auto" }}
        className="no-p-margin mt-3 "
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className="fw-bold"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Customers.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={Customers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Customers;
