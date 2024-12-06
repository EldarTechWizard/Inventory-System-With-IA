import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Formik } from "formik";
import * as Yup from "yup";
import "../styles/formProduct.css";
import { fetchData, postData, updateData } from "../hooks/apiManager";

// Define the Yup validation schema
const validationSchema = Yup.object({
  productName: Yup.string().required("El nombre del producto es obligatorio"),
  barcode: Yup.string()
    .matches(
      /^\d{8,13}$/,
      "El código de barras debe tener minimo 8 digitos y máximo 13 dígitos"
    )
    .required("El código de barras es obligatorio"),
  unitPrice: Yup.number()
    .positive("El precio de compra debe ser mayor a 0")
    .required("El precio de compra es obligatorio"),
  sellPrice: Yup.number()
    .positive("El precio de venta debe ser mayor a 0")
    .required("El precio de venta es obligatorio"),
  unitsInStock: Yup.number()
    .positive("El número de unidades debe ser mayor a 0")
    .required("Las unidades en stock son obligatorias"),
  minimumStockLevel: Yup.number()
    .positive("El nivel mínimo en stock debe ser mayor a 0")
    .required("El nivel mínimo en stock es obligatorio"),
  categoryId: Yup.number().required("Debe seleccionar una categoría"),
  supplier_id: Yup.number().required("Debe seleccionar un proveedor"),
  expirationDate: Yup.date().required("La fecha de caducidad es obligatoria"),
});

function ModalFormProduct({ getData, product, LabelButton }) {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitsInStock, setUnitsInStock] = useState("");
  const [expirationDate, setExpirationDate] = useState(dayjs(new Date()));
  const [categoryId, setCategoryId] = useState("");
  const [supplier_id, setSupplier_id] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [minimumStockLevel, setMinumumStockLevel] = useState("");

  useEffect(() => {
    fetchData("/categories").then(setCategories).catch(console.error);
    fetchData("/suppliers").then(setSuppliers).catch(console.error);
  }, []);

  useEffect(() => {
    if (product) {
      setProductName(product.product_name);
      setBarcode(product.barcode);
      setUnitPrice(product.unit_price);
      setSellPrice(product.sell_price);
      setMinumumStockLevel(product.minimum_stock_level);
      setUnitsInStock(product.units_in_stock);
      setExpirationDate(dayjs(product.expiration_date));
      setCategoryId(product.category);
      setSupplier_id(product.supplier);
    }
  }, [product]);

  const handleSubmit = async (values) => {
    const data = {
      product_name: values.productName,
      barcode: values.barcode,
      unit_price: values.unitPrice,
      sell_price: values.sellPrice,
      minimum_stock_level: Number(values.minimumStockLevel),
      units_in_stock: Number(values.unitsInStock),
      expiration_date: values.expirationDate.format("YYYY-MM-DD"),
      category: Number(values.categoryId),
      supplier: Number(values.supplier_id),
    };

    try {
      let result = {};
      if (product) {
        result = await updateData(`/products/${product.product_id}/`, data);
      } else {
        result = await postData("/products/", data);
      }

      getData();
      handleClose();
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {LabelButton}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {product
              ? "Editar informacion del producto"
              : "Agregar nuevo producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              productName,
              barcode,
              unitPrice,
              sellPrice,
              minimumStockLevel,
              unitsInStock,
              categoryId,
              supplier_id,
              expirationDate: dayjs(expirationDate),
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className="d-flex justify-content-evenly ">
                  <div className="d-flex flex-column gap-4">
                    <Form.Group controlId="formProductName">
                      <Form.Label>Nombre del Producto</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre del producto"
                        name="productName"
                        value={values.productName}
                        onChange={handleChange}
                        isInvalid={touched.productName && !!errors.productName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.productName}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBarcode">
                      <Form.Label>Código de Barra</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el código de barra"
                        name="barcode"
                        maxLength={13}
                        value={values.barcode}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        onChange={handleChange}
                        isInvalid={touched.barcode && !!errors.barcode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.barcode}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formUnitPrice">
                      <Form.Label>Precio de compra</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el precio unitario"
                        name="unitPrice"
                        value={values.unitPrice}
                        onChange={handleChange}
                        isInvalid={touched.unitPrice && !!errors.unitPrice}
                        onInput={(e) => {
                          let inputValue = e.target.value;
                          inputValue = inputValue.replace(/[^0-9.]/g, "");
                          if ((inputValue.match(/\./g) || []).length > 1) {
                            inputValue = inputValue.replace(/\.(?=.*\.)/, "");
                          }

                          const [integerPart, decimalPart] =
                            inputValue.split(".");
                          if (decimalPart && decimalPart.length > 2) {
                            inputValue = `${integerPart}.${decimalPart.slice(
                              0,
                              2
                            )}`;
                          }
                          e.target.value = inputValue;
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitPrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formSellPrice">
                      <Form.Label>Precio de Venta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el precio de venta"
                        name="sellPrice"
                        value={values.sellPrice}
                        onChange={handleChange}
                        isInvalid={touched.sellPrice && !!errors.sellPrice}
                        onInput={(e) => {
                          let inputValue = e.target.value;
                          inputValue = inputValue.replace(/[^0-9.]/g, "");

                          if ((inputValue.match(/\./g) || []).length > 1) {
                            inputValue = inputValue.replace(/\.(?=.*\.)/, "");
                          }
                          const [integerPart, decimalPart] =
                            inputValue.split(".");
                          if (decimalPart && decimalPart.length > 2) {
                            inputValue = `${integerPart}.${decimalPart.slice(
                              0,
                              2
                            )}`;
                          }
                          e.target.value = inputValue;
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sellPrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="d-flex flex-column gap-4">
                    <Form.Group controlId="formUnitsInStock">
                      <Form.Label>Unidades en Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese el número de unidades"
                        name="unitsInStock"
                        value={values.unitsInStock}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        isInvalid={
                          touched.unitsInStock && !!errors.unitsInStock
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitsInStock}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formMinimumStockLevel">
                      <Form.Label>Minimo nivel en Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese el número de unidades"
                        name="minimumStockLevel"
                        value={values.minimumStockLevel}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        isInvalid={
                          touched.minimumStockLevel &&
                          !!errors.minimumStockLevel
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.minimumStockLevel}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formCategoryId">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Control
                        as="select"
                        name="categoryId"
                        value={values.categoryId}
                        onChange={handleChange}
                        isInvalid={touched.categoryId && !!errors.categoryId}
                      >
                        <option value="">Seleccionar Categoría</option>
                        {categories.map((p) => (
                          <option key={p.category_id} value={p.category_id}>
                            {p.category_name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.categoryId}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formSupplierId">
                      <Form.Label>Proveedores</Form.Label>
                      <Form.Control
                        as="select"
                        name="supplier_id"
                        value={values.supplier_id}
                        onChange={handleChange}
                        isInvalid={touched.supplier_id && !!errors.supplier_id}
                      >
                        <option value="">Seleccionar Proveedor</option>
                        {suppliers.map((p) => (
                          <option key={p.supplier_id} value={p.supplier_id}>
                            {p.supplier_name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.supplier_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="d-flex flex-column groups">
                    <Form.Group controlId="formExpirationDate">
                      <Form.Label>Fecha de Caducidad</Form.Label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                          value={values.expirationDate}
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
                <Modal.Footer>
                  <Button
                    variant="danger"
                    onClick={handleClose}
                    className="mx-2"
                  >
                    Cancelar
                  </Button>
                  <Button variant="success" type="submit">
                    Guardar
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalFormProduct;
