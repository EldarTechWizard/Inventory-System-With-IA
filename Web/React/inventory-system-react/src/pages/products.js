import React, { useState, useEffect, useContext } from "react";
import "../styles/products.css";
import ModalFormProduct from "../components/formProduct";
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
import ModalFormCategory from "../components/formCategories";

const columns = [
  { id: "product_id", label: "Id", minWidth: 100 },
  { id: "product_name", label: "Nombre", minWidth: 170 },
  {
    id: "barcode",
    label: "Codigo de barras",
    minWidth: 170,
  },
  {
    id: "unit_price",
    label: "Precio de compra",
    minWidth: 170,
  },
  {
    id: "sell_price",
    label: "Precio de venta",
    minWidth: 170,
  },
  {
    id: "minimum_stock_level",
    label: "Stock Minimo",
    minWidth: 170,
  },
  {
    id: "units_in_stock",
    label: "Unidades en stock",
    minWidth: 170,
  },
  {
    id: "registration_date",
    label: "Fecha de registro",
    minWidth: 170,
  },
  {
    id: "expiration_date",
    label: "Fecha de expiracion",
    minWidth: 170,
  },
  {
    id: "category_name",
    label: "Categoria",
    minWidth: 170,
  },
  {
    id: "supplier_name",
    label: "Proveedor",
    minWidth: 170,
  },
  { id: "actions", label: "Acciones", minWidth: 170 },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const getData = async () => {
    const result = await fetchData("/products");
    setProducts(result);
    setFilteredData(result);
  };
  useEffect(() => {
    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleFilter = () => {
    const filtered = products.filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase())
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
    <div id="products" className="d-flex m-2 bg-white border p-2 flex-column">
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
        <div className="h-100 d-flex gap-3">
          <ModalFormCategory LabelButton="Agregar Categoria" />
          <ModalFormProduct getData={getData} LabelButton="Agregar producto" />
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
                      key={row.product_id}
                    >
                      {columns.map((column) => {
                        // Renderizar la columna de acciones
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <ModalFormProduct
                                getData={getData}
                                LabelButton="Editar"
                                product={row}
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
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Products;
