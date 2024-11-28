import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { fetchData, postData } from "../hooks/apiManager";
import "../styles/formInventoryMovement.css";

function ModalFormSupplier({ getData }) {
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [registrationDate, setRegistrationDate] = useState(dayjs(new Date()));

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleSubmit() {
    const data = {
      supplier_name: supplierName,
      contact_person: contactPerson,
      phone: phone,
      email: email,
      address: address,
      registration_date: registrationDate.format("YYYY-MM-DD"),
    };

    try {
      const result = await postData("/suppliers/", data);
      await getData();
      handleClose();
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Agregar movimiento
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex justify-content-evenly">
            <div className="d-flex flex-column textFieldsContainers">
              <Form.Group controlId="formSupplierName">
                <Form.Label>Nombre del proveedor</Form.Label>
                <Form.Control
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formContact">
                <Form.Label>Nombre de contacto</Form.Label>
                <Form.Control
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formNumero">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Direccion</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="d-flex flex-column w-40 ContainerDatePicker">
              <Form.Label>Fecha de registro</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  value={registrationDate}
                  onChange={(e) => setRegistrationDate(e)}
                  slotProps={{
                    actionBar: {
                      actions: [""],
                    },
                  }}
                  readOnly
                />
              </LocalizationProvider>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose} className="mx-2">
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalFormSupplier;
