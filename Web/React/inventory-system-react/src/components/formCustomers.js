import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { fetchData, postData } from "../hooks/apiManager";
import "../styles/formCustomers.css";

function ModalFormCustomers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleSubmit() {
    const data = {
      name: name,
      email: email,
      phone: phone,
      address: address,
    };

    console.log(data);

    try {
      const result = await postData("/customers/", data);

      handleClose();
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Agregar cliente
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex justify-content-evenly my-5">
            <div className="d-flex flex-column textFieldsContainers">
              <Form.Group controlId="formProductName">
                <Form.Label>Nombre del clientee</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre del producto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formProductName">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="d-flex flex-column textFieldsContainers">
              <Form.Group controlId="formProductName">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="6741223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formProductName">
                <Form.Label>Direccion</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="address #23"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
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

export default ModalFormCustomers;
