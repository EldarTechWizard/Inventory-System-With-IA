import React, { useState, useEffect } from "react";
import ModalFormInventoryMovement from "../components/formInventoryMovement";
import { fetchData } from "../hooks/apiManager";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "movement_id", label: "Id", minWidth: 170 },
  { id: "movement_type", label: "Tipo de movimiento", minWidth: 100 },
  {
    id: "quantity",
    label: "Cantidad",
    minWidth: 170,
  },
  {
    id: "movement_date",
    label: "Fecha Mov",
    minWidth: 170,
  },
  {
    id: "remarks",
    label: "Comentarios",
    minWidth: 170,
  },
  {
    id: "product_name",
    label: "Producto",
    minWidth: 170,
  },
];

function InventoryMovement() {
  const [inventoryMovements, setInventoryMovements] = useState([]);
  const getData = async () => {
    setInventoryMovements(await fetchData("/inventory-movements"));
  };

  useEffect(() => {
    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div
      id="inventoryMovement"
      className="d-flex m-2 bg-white border p-2 flex-column"
    >
      <div className="d-flex w-100 p-2 justify-content-between">
        <input type="text" placeholder="Search.." className="w-50" />
        <ModalFormInventoryMovement getData={getData} />
      </div>

      <Paper sx={{ width: "100%" }} className="no-p-margin mt-3">
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
              {inventoryMovements
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
          count={inventoryMovements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default InventoryMovement;
