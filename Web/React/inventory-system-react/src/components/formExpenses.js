import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchData, postData, updateData } from "../hooks/apiManager";
import "../styles/formExpenses.css";

function ModalFormExpenses({ getData, expense, LabelButton }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Valores iniciales del formulario
  const initialValues = {
    description: expense?.description || "",
    paymentMethod: expense?.payment_method || "",
    amount: expense?.amount || "",
  };

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .required("La descripción es obligatoria.")
      .max(100, "La descripción no puede superar los 100 caracteres."),
    paymentMethod: Yup.string()
      .required("El método de pago es obligatorio.")
      .max(50, "El método de pago no puede superar los 50 caracteres."),
    amount: Yup.number()
      .required("El monto es obligatorio.")
      .min(0.01, "El monto debe ser mayor a 0."),
  });

  // Manejo del envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      description: values.description,
      payment_method: values.paymentMethod,
      amount: Number(values.amount),
    };

    try {
      let result = "";

      if (expense) {
        result = await updateData(`/expenses/${expense.expenses_id}/`, data);
      } else {
        result = await postData("/expenses/", data);
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
        className="expense"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {expense ? "Editar información del gasto" : "Agregar nuevo gasto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <FormikForm className="d-flex flex-column p-4 w-100 gap-4">
                <Form.Group controlId="formDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Field
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="Ingrese el nombre del gasto"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formPaymentMethod">
                  <Form.Label>Método de pago</Form.Label>
                  <Field
                    type="text"
                    name="paymentMethod"
                    className="form-control"
                    placeholder="Ingrese el método de pago"
                  />
                  <ErrorMessage
                    name="paymentMethod"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formAmount">
                  <Form.Label>Monto</Form.Label>
                  <Field
                    type="number"
                    name="amount"
                    className="form-control"
                    step="1" // Solo enteros
                    placeholder="$0"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Modal.Footer className="mt-2 px-0 gap-2">
                  <Button
                    variant="danger"
                    onClick={handleClose}
                    className="mx-2"
                  >
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

export default ModalFormExpenses;
