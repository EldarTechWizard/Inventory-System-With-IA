import { Table, Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchData, postData, updateData } from "../hooks/apiManager";
import "../styles/formInventoryMovement.css";

function ModalFormInventoryMovement({
  getData,
  inventoryMovement,
  LabelButton,
}) {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchProducts = async () => {
    setProducts(await fetchData("/products"));
  };

  useEffect(() => {
    if (show) {
      fetchProducts();
    }
  }, [show]);

  const initialValues = {
    movementType: inventoryMovement?.movement_type || "",
    product: inventoryMovement?.product || "",
    quantity: inventoryMovement?.quantity || "",
    remarks: inventoryMovement?.remarks || "",
  };

  const validationSchema = Yup.object().shape({
    movementType: Yup.string().required(
      "El tipo de movimiento es obligatorio."
    ),
    product: Yup.string().required("Seleccionar un producto es obligatorio."),
    quantity: Yup.number()
      .required("La cantidad es obligatoria.")
      .min(1, "La cantidad debe ser al menos 1.")
      .integer("La cantidad debe ser un número entero."),
    remarks: Yup.string().max(
      200,
      "El comentario no puede superar los 200 caracteres."
    ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      product: Number(values.product),
      quantity: Number(values.quantity),
      movement_type: values.movementType,
      remarks: values.remarks,
    };

    try {
      let result = null;

      if (inventoryMovement) {
        result = await updateData(
          `/inventory-movements/${inventoryMovement.movement_id}/`,
          data
        );
      } else {
        result = await postData("/inventory-movements/", data);
      }

      await getData();
      handleClose();
      resetForm();
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
        className="inventory-movement"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {inventoryMovement
              ? "Editar un movimiento"
              : "Agregar un nuevo movimiento"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <FormikForm className="d-flex flex-column w-100 p-3 gap-4">
                <Form.Group controlId="formMovement">
                  <Form.Label>Movimiento</Form.Label>
                  <Field
                    as="select"
                    name="movementType"
                    className="form-control"
                  >
                    <option value="">Seleccionar tipo de movimiento</option>
                    <option value="IN">Entrada</option>
                    <option value="OUT">Salida</option>
                  </Field>
                  <ErrorMessage
                    name="movementType"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formProduct">
                  <Form.Label>Producto</Form.Label>
                  <Field as="select" name="product" className="form-control">
                    <option value="">Seleccionar producto</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="product"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formQuantity">
                  <Form.Label>Cantidad</Form.Label>
                  <Field
                    type="number"
                    name="quantity"
                    className="form-control"
                    step="1"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formRemarks">
                  <Form.Label>Comentarios</Form.Label>
                  <Field
                    as="textarea"
                    rows={4}
                    name="remarks"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="remarks"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Modal.Footer className="px-0 gap-3">
                  <Button variant="danger" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Guardar
                  </Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalFormInventoryMovement;
