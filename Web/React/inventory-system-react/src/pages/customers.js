import React, { useState, useEffect, useContext } from "react";
import "../styles/products.css";
import { fetchData } from "../hooks/apiManager";
import { Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
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
  { id: "actions", label: "Acciones", minWidth: 170 },
];

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const getData = async () => {
    const result = await fetchData("/customers");
    setCustomers(result);
    setFilteredData(result);
  };

  useEffect(() => {
    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleFilter = () => {
    const filtered = customers.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  };

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
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search..."
            className="w-100 rounded-0 rounded-start-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={handleFilter}
            className="rounded-0 rounded-end-3"
          >
            <SearchIcon />
          </Button>
        </div>
        <div className="h-100">
          <ModalFormCustomers getData={getData} LabelButton="Agregar cliente" />
        </div>
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
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <ModalFormCustomers
                                getData={getData}
                                LabelButton="Editar"
                                customer={row}
                              />
                            </TableCell>
                          );
                        }

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
