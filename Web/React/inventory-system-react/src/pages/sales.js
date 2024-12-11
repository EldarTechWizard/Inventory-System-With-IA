import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Modal, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import "../styles/sales.css";
import barcodeImg from "../assets/Barcode.png";
import { fetchData, postData } from "../hooks/apiManager";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LocalSeeIcon from "@mui/icons-material/LocalSee";
import { useNotifications } from "../context/notificationContext";

const BarcodeScanner = ({ onBarcodeScanned }) => {
  const [barcode, setBarcode] = useState("");
  const [isReading, setIsReading] = useState(false);

  const invisibleInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isReading) {
        setIsReading(true);
        setBarcode("");
      }
      if (event.key === "Enter") {
        onBarcodeScanned(barcode);
        setIsReading(false);
      } else if (!isNaN(event.key) || /^[a-zA-Z0-9\-]+$/.test(event.key)) {
        setBarcode((prev) => prev + event.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcode, isReading]);

  return (
    <div>
      <input
        ref={invisibleInputRef}
        type="text"
        value={barcode}
        onChange={() => {}}
        style={{
          position: "absolute",
          left: "-9999px", // Mantenerlo fuera de la pantalla
        }}
      />
    </div>
  );
};

function Sales() {
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { reloadMinimumStockProducts } = useNotifications();

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
    setError("");
  };

  const handleConfirmModalShow = () => {
    if (cart.length === 0) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleClose = () => {
    setShow(false);
    setError("");
    setBarcode(null);
  };
  const handleShow = () => setShow(true);

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

    setCart((prevCart) =>
      prevCart.filter((item) => !selectedIds.includes(item.id))
    );

    setSelectedRows([]);
  };

  const handleIncrement = (id) => {
    setCart((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, quantity: row.quantity + 1 } : row
      )
    );
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (/^\d*$/.test(newQuantity)) {
      setCart((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, quantity: newQuantity } : row
        )
      );
    }
  };

  const handleBlur = (id, newQuantity) => {
    if (newQuantity === "0") {
      setCart((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, quantity: 1 } : row))
      );
      handleDecrement(id);
    }
    if (newQuantity.trim() === "") {
      setCart((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, quantity: 1 } : row))
      );
    }
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
    const selectedData = cart.filter((row) =>
      newSelectionModel.includes(row.id)
    );
    setSelectedRows(selectedData);
  };

  const handleDelete = () => {
    const aux = [...selectedRows];
    aux.map((p) => deleteCart(p.id));
  };

  const handleConfirm = async () => {
    try {
      if (!selectedCustomer) {
        setError("Debe seleccionar un cliente antes de confirmar la compra.");
        return;
      }

      const order = {
        customers: selectedCustomer,
        total_amount: String(total.toFixed(2)),
      };

      const result = await postData("/orders/", order);

      if (result) {
        const order_details = cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          order: result.order_id,
          unit_price: String(item.sell_price),
        }));

        const resultOrderDetails = await postData(
          "/order-details/post-list/",
          order_details
        );

        setCart([]);
        reloadMinimumStockProducts();
      }

      handleConfirmModalClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchProduct = async (barcode1) => {
    const result = await fetchData(`products/?barcode=${barcode1}`);

    if (result.length) {
      addToCart({
        id: result[0].product_id,
        name: result[0].product_name,
        sell_price: result[0].sell_price,
        quantity: 1,
      });
      handleClose();
    } else {
      setError("*Producto no encontrado*");
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
      cellClassName: (params) =>
        "d-flex justify-content-center no-focus-outline",
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDecrement(params.row.id);
            }}
          >
            -
          </Button>
          <input
            type="text"
            className="mx-3 form-control text-center no-focus-outline"
            style={{ width: "60px" }}
            value={params.row.quantity}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => handleBlur(params.row.id, e.target.value)}
            onChange={(e) => {
              e.stopPropagation();
              handleQuantityChange(params.row.id, e.target.value);
            }}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleIncrement(params.row.id);
            }}
          >
            +
          </Button>
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
      setCustomers(await fetchData("/customers/"));
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
            disableRowSelectionOnClick
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
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
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
          <div className="d-flex gap-2">
            <Form.Select
              className=" h-2"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value={0}>{"Selecciona una categoria"}</option>
              {categories.map((p) => (
                <option value={p.category_id}>{p.category_name}</option>
              ))}
            </Form.Select>
            <Button variant="danger" onClick={handleDelete}>
              <DeleteIcon />
            </Button>
            <BarcodeScanner onBarcodeScanned={handleSearchProduct} />
          </div>

          <div className="controls d-flex gap-2  justify-content-end">
            <Modal show={show} onHide={handleClose} className="ModalBarcode">
              <Modal.Body>
                <div className="d-flex align-items-center gap-2">
                  <img src={barcodeImg} alt="" width={70} height={35} />

                  <Form.Control
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between mt-3 align-items-center">
                  <Button variant="danger" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <p className="m-0 text-danger">{error}</p>
                  <Button variant="primary" onClick={handleSearchProduct}>
                    Buscar
                  </Button>
                </div>
              </Modal.Body>
            </Modal>

            <Button
              onClick={handleShow}
              className="align-items-center d-flex gap-2 colorDarkBlue text-nowrap"
            >
              <LocalSeeIcon />
              Escanear producto
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmModalShow}
              className="align-items-center d-flex gap-2"
            >
              <InsertDriveFileIcon />
              Confirmar
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
          <Modal show={showConfirmModal} onHide={handleConfirmModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="customer-select" className="form-label">
                  Seleccione un cliente
                </label>
                <select
                  id="customer-select"
                  className="form-select"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">-- Seleccione un cliente --</option>

                  {customers.map((customer) => (
                    <option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>
                <p className="m-0 text-danger">{error}</p>
              </div>
              ¿Está seguro que desea confirmar la compra por un total de $
              {total.toFixed(2)}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleConfirmModalClose}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleConfirm}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
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
