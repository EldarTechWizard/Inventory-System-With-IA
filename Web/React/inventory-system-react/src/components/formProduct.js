import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../styles/formProduct.css";
import { fetchData, postData } from "../hooks/apiManager";

function ModalFormProduct() {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitsInStock, setUnitsInStock] = useState("");
  const [registrationDate, setRegistrationDate] = useState(dayjs(new Date()));
  const [expirationDate, setExpirationDate] = useState(dayjs(new Date()));
  const [categoryId, setCategoryId] = useState("");
  const [supplier_id, setSupplier_id] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [minimum_stock_level, setMinimum_stock_level] = useState("");

  const fetchCategories = async () => {
    try {
      const result = await fetchData("/categories");
      setCategories(result);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await fetchData("/suppliers");
      setSuppliers(result);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      product_name: productName,
      barcode: barcode,
      unit_price: unitPrice,
      sell_price: sellPrice,
      minimum_stock_level: Number(minimum_stock_level),
      units_in_stock: Number(unitsInStock),
      registration_date: registrationDate.format("YYYY-MM-DD"),
      expiration_date: expirationDate.format("YYYY-MM-DD"),
      category: Number(categoryId),
      supplier: Number(supplier_id),
    };

    try {
      const result = await postData("/products/", data);
      handleClose();
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Agregar Productos
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="d-flex justify-content-evenly">
              <div className="d-flex flex-column groups">
                <Form.Group controlId="formProductName">
                  <Form.Label>Nombre del Producto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre del producto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBarcode">
                  <Form.Label>Código de Barra</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el código de barra"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formUnitPrice">
                  <Form.Label>Precio de compra</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el precio unitario"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formSellPrice">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el precio de venta"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="d-flex flex-column groups">
                <Form.Group controlId="formUnitsInStock">
                  <Form.Label>Unidades en Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el número de unidades"
                    value={unitsInStock}
                    onChange={(e) => setUnitsInStock(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formMinimumStockLevel">
                  <Form.Label>Unidades en Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el número de unidades"
                    value={minimum_stock_level}
                    onChange={(e) => setMinimum_stock_level(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formCategoryId">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    as="select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categories.map((p) => (
                      <option value={p.category_id}>{p.category_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formSupplierId">
                  <Form.Label>Proveedores</Form.Label>
                  <Form.Control
                    as="select"
                    value={supplier_id}
                    onChange={(e) => setSupplier_id(e.target.value)}
                  >
                    <option value="">Seleccionar Proveedor</option>
                    {suppliers.map((p) => (
                      <option value={p.supplier_id}>{p.supplier_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>

              <div className="d-flex flex-column groups">
                <Form.Group controlId="formRegistrationDate">
                  <Form.Label>Fecha de Registro</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Controlled picker"
                      value={registrationDate}
                      onChange={(newValue) => setRegistrationDate(newValue)}
                      className="pt-2"
                      readOnly
                    />
                  </LocalizationProvider>
                </Form.Group>

                <Form.Group controlId="formExpirationDate">
                  <Form.Label>Fecha de Caducidad</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e)}
                      slotProps={{
                        actionBar: {
                          actions: [""],
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="danger" onClick={handleClose} className="mx-2">
                Cancelar
              </Button>
              <Button variant="success" onClick={handleSubmit}>
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalFormProduct;
