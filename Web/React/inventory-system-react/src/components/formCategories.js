import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData, updateData } from "../hooks/apiManager";
import "../styles/formCategories.css";

function ModalFormCategory({ category, LabelButton }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialValues = {
    name: category?.category_name || "",
    description: category?.description || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre de la categoría es obligatorio.")
      .max(50, "El nombre no puede exceder los 50 caracteres."),
    description: Yup.string().max(
      200,
      "La descripción no puede exceder los 200 caracteres."
    ),
  });

  // Manejo del envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      category_name: values.name,
      description: values.description,
    };

    try {
      if (category) {
        await updateData(`/categories/${category.category_id}/`, data);
      } else {
        await postData("/categories/", data);
      }
      handleClose();
      resetForm();
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        {LabelButton}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="categories"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {category ? "Editar categoría" : "Agregar nueva categoría"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <FormikForm className="d-flex flex-column gap-4 w-100 px-5 py-4">
                <Form.Group controlId="formCategorieName">
                  <Form.Label>Nombre de la categoría</Form.Label>
                  <Field
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Ingrese el nombre de la categoría"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control"
                    rows={4}
                    placeholder="Ingrese una descripción (opcional)"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Modal.Footer className="px-0 gap-3 mt-2">
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

export default ModalFormCategory;
