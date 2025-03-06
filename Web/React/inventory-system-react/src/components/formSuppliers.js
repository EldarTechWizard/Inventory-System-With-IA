import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { postData, updateData } from "../hooks/apiManager";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/formSuppliers.css";

const validationSchema = Yup.object({
  supplierName: Yup.string().required("El nombre del proveedor es obligatorio"),
  contactPerson: Yup.string(),
  phone: Yup.string().matches(
    /^(?:\d{3}-\d{3}-\d{4}|\d{10})$/,
    "El teléfono debe tener el formato 123-345-6789."
  ),
  email: Yup.string().matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Ingrese un email válido."
  ),
  address: Yup.string(),
});

function ModalFormSupplier({ getData, supplier, LabelButton }) {
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (supplier) {
      setSupplierName(supplier.supplier_name);
      setContactPerson(supplier.contact_person);
      setPhone(supplier.phone);
      setEmail(supplier.email);
      setAddress(supplier.address);
    }
  }, [supplier]);

  async function handleSubmit(values, { setErrors }) {
    const data = {
      supplier_name: values.supplierName,
      contact_person: values.contactPerson,
      phone: values.phone.replace(/-/g, ""),
      email: values.email,
      address: values.address,
    };

    try {
      let result = null;
      if (supplier) {
        result = await updateData(`/suppliers/${supplier.supplier_id}/`, data);
      } else {
        result = await postData("/suppliers/", data);
      }

      await getData();
      handleClose();
    } catch (err) {
      setErrors({
        email: err.email ? err.email[0] : null,
        phone: err.phone ? err.phone[0] : null,
      });
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="button-modal">
        {LabelButton}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="supplier"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {supplier
              ? "Editar informacion del proveedor"
              : "Agregar nuevo proveedor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              supplierName: supplierName,
              contactPerson: contactPerson,
              phone: phone,
              email: email,
              address: address,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <FormikForm className="d-flex flex-column justify-content-evenly">
                <div className="d-flex flex-column gap-4 p-4">
                  <Form.Group controlId="formSupplierName">
                    <Form.Label>Nombre del proveedor</Form.Label>
                    <Field
                      type="text"
                      name="supplierName"
                      className="form-control"
                      value={values.supplierName}
                      onChange={(e) =>
                        setFieldValue("supplierName", e.target.value)
                      }
                    />
                    <ErrorMessage
                      name="supplierName"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group controlId="formContact">
                    <Form.Label>Nombre de contacto</Form.Label>
                    <Field
                      type="text"
                      name="contactPerson"
                      className="form-control"
                      value={values.contactPerson}
                      onChange={(e) =>
                        setFieldValue("contactPerson", e.target.value)
                      }
                    />
                    <ErrorMessage
                      name="contactPerson"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>

                  <Form.Group controlId="formAddress">
                    <Form.Label>Dirección</Form.Label>
                    <Field
                      type="text"
                      name="address"
                      className="form-control"
                      value={values.address}
                      onChange={(e) => setFieldValue("address", e.target.value)}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group controlId="formNumero">
                    <Form.Label>Teléfono</Form.Label>
                    <Field
                      type="text"
                      name="phone"
                      className="form-control"
                      value={values.phone}
                      onChange={(e) => setFieldValue("phone", e.target.value)}
                      onInput={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 3 && value.length <= 6) {
                          value = `${value.slice(0, 3)}-${value.slice(3)}`;
                        } else if (value.length > 6) {
                          value = `${value.slice(0, 3)}-${value.slice(
                            3,
                            6
                          )}-${value.slice(6, 10)}`;
                        }
                        e.target.value = value;
                      }}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Field
                      type="text"
                      name="email"
                      className="form-control"
                      value={values.email}
                      onChange={(e) => setFieldValue("email", e.target.value)}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
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
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalFormSupplier;
