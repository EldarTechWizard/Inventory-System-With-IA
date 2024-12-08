import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData, updateData } from "../hooks/apiManager";
import "../styles/formCustomers.css";

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre del cliente es obligatorio."),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Ingrese un email válido."
    )
    .required("El email es obligatorio."),
  phone: Yup.string().matches(
    /^(?:\d{3}-\d{3}-\d{4}|\d{10})$/,
    "El teléfono debe tener el formato 123-345-6789."
  ),
  address: Yup.string(),
});

function ModalFormCustomers({ getData, customer, LabelButton }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialValues = {
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sanitizedData = {
      ...values,
      phone: values.phone.replace(/-/g, ""),
    };

    try {
      if (customer) {
        await updateData(`/customers/${customer.customer_id}/`, sanitizedData);
      } else {
        await postData("/customers/", sanitizedData);
      }
      await getData();
      resetForm();
      handleClose();
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setSubmitting(false);
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
        className="customer"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {customer
              ? "Editar información del cliente"
              : "Agregar nuevo cliente"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <Modal.Body className="d-flex flex-column w-100 gap-4 p-4">
                <Form.Group controlId="formCustomerName">
                  <Form.Label>Nombre del cliente</Form.Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Ingrese el nombre del cliente"
                    className="form-control"
                    pattern="[a-zA-Z\s]*"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ))
                    }
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formCustomerEmail">
                  <Form.Label>Email</Form.Label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formCustomerPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Field
                    name="phone"
                    type="text"
                    placeholder="674-122-3344"
                    className="form-control"
                    maxLength="12"
                    onInput={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
                      if (value.length > 3 && value.length <= 6) {
                        value = `${value.slice(0, 3)}-${value.slice(3)}`;
                      } else if (value.length > 6) {
                        value = `${value.slice(0, 3)}-${value.slice(
                          3,
                          6
                        )}-${value.slice(6, 10)}`;
                      }
                      e.target.value = value; // Asigna el valor formateado al input
                    }}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formCustomerAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Field
                    name="address"
                    type="text"
                    placeholder="Ingrese su dirección"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="danger"
                  onClick={handleClose}
                  className="mx-2"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default ModalFormCustomers;
