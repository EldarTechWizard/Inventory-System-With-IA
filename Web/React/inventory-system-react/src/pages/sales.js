import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { filledInputClasses } from "@mui/material";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import "../styles/sales.css";
import { fetchData, postData } from "../hooks/apiManager";

function Sales() {
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    setTotal(
      cart.reduce((total, item) => total + item.sell_price * item.quantity, 0)
    );
  };

  const addToCart = (product) => {
    if (cart.some((p) => p.id === product.id)) {
      handleIncrement(product.id);
    } else {
      setCart((prevCart) => [...prevCart, product]);
    }
  };
  const deleteCart = (id) => {
    const selectedIds = selectedRows.map((p) => p.id);

    // Actualiza el carrito eliminando todos los elementos seleccionados
    setCart((prevCart) =>
      prevCart.filter((item) => !selectedIds.includes(item.id))
    );

    // Limpia la selección
    setSelectedRows([]);
  };

  const handleIncrement = (id) => {
    setCart((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, quantity: row.quantity + 1 } : row
      )
    );
  };

  const handleDecrement = (id) => {
    setCart((prevRows) =>
      prevRows
        .map((row) =>
          row.id === id
            ? {
                ...row,
                quantity: Math.max(row.quantity - 1, 0),
              }
            : row
        )
        .filter((row) => row.quantity > 0)
    );
  };

  const handleSelectionChange = (newSelectionModel) => {
    const selectedData = cart.filter(
      (row) => newSelectionModel.includes(row.id) // Filtra las filas seleccionadas
    );
    setSelectedRows(selectedData);
  };

  const handleDelete = () => {
    const aux = [...selectedRows];
    aux.map((p) => deleteCart(p.id));
  };

  const handleConfirm = async () => {
    const order = { customers: 1, total_amount: String(total.toFixed(2)) };
    console.log(order);
    const result = await postData("/orders/", order);

    if (result) {
      const order_details = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        order: result.order_id,
        unit_price: String(item.sell_price),
      }));

      console.log(order_details);

      const resultOrderDetails = await postData(
        "/order-details/post-list/",
        order_details
      );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 70,
    },
    {
      field: "name",
      headerName: "Articulo",
      headerClassName: "super-app-theme--header",
      flex: 3,
    },
    {
      field: "sell_price",
      headerName: "Precio",
      headerClassName: "super-app-theme--header",
      flex: 1,

      renderCell: (params) => <span>${params.row.sell_price}</span>,
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      headerClassName: "super-app-theme--header",

      flex: 1,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <Button onClick={() => handleDecrement(params.row.id)}>-</Button>
          <span className="mx-3">{params.row.quantity}</span>
          <Button onClick={() => handleIncrement(params.row.id)}>+</Button>
        </div>
      ),
    },
    {
      field: "subTotal",
      headerName: "SubTotal",
      headerClassName: "super-app-theme--header",
      flex: 1,
      renderCell: (params) => {
        const valueColumn1 = params.row.quantity;
        const valueColumn2 = params.row.sell_price;

        return <span>${(valueColumn1 * valueColumn2).toFixed(2)}</span>;
      },
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories(await fetchData("/categories/"));
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory)
        setProducts(await fetchData(`/products/category/${selectedCategory}`));
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  return (
    <div className="d-flex flex-column p-2 bg-white salesPage">
      <div className="w-100 relative overflow-auto salesContainer">
        <Paper
          sx={{
            height: 400,
            width: "100%",
          }}
        >
          <DataGrid
            rows={cart}
            columns={columns}
            pagination={false}
            checkboxSelection
            disableColumnMenu
            disableAutosize
            disableColumnSorting
            disableColumnResize
            hideFooter
            onRowSelectionModelChange={handleSelectionChange}
            selectionModel={selectedRows.map((row) => row.id)}
            initialState={{
              pagination: {
                paginationModel: cart.length > 0 ? cart.length : 1, // Show all rows
              },
            }}
            sx={{
              border: 0,
              "& .super-app-theme--header": {
                backgroundColor: "#004AAD",
                color: "white",
                textAlign: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "inherit", // Quita el efecto hover en las filas
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none", // Elimina el efecto de focus en las celdas
              },
              "& .MuiDataGrid-root": {
                overflowX: "auto",
              },
            }}
          />
        </Paper>
      </div>
      <div className="d-flex flex-column w-100 mt-3 footerContainer">
        <div className="d-flex w-100 justify-content-between footerBar">
          <Form.Select
            className="comboBox h-2"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          >
            <option value={0}>{"Seleccion una categoria"}</option>
            {categories.map((p) => (
              <option value={p.category_id}>{p.category_name}</option>
            ))}
          </Form.Select>
          <div className="controls d-flex gx-5  justify-content-end">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="success" onClick={handleConfirm} className="mx-3">
              Confirm
            </Button>
            <InputGroup className="inputGroup">
              <InputGroup.Text
                id="totalLabel"
                style={{
                  backgroundColor: "#004AAD",
                  color: "#fff",
                }}
              >
                Total
              </InputGroup.Text>
              <Form.Control
                placeholder="$0"
                readOnly
                value={`$${total.toFixed(2)}`}
              />
            </InputGroup>
          </div>
        </div>
        <div className="mh-100 mt-2 p-2 productsContainer">
          {products.map((product) => (
            <Button
              key={product.product_id}
              variant="secondary"
              onClick={() =>
                addToCart({
                  id: product.product_id,
                  name: product.product_name,
                  sell_price: product.sell_price,
                  quantity: 1,
                })
              }
              className="productButton"
            >
              {product.product_name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sales;
