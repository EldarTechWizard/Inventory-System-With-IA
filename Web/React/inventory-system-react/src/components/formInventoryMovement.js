import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { fetchData, postData } from "../hooks/apiManager";
import "../styles/formInventoryMovement.css";

function ModalFormInventoryMovement() {
  const [movementType, setMovementType] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [movementDate, setMovementDate] = useState(dayjs(new Date()));

  const [products, setProducts] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await fetchData("/products"));
    };

    fetchProducts();
  }, []);

  async function handleSubmit() {
    const data = {
      product: Number(product),
      quantity: Number(quantity),
      movement_type: movementType,
      movement_date: movementDate.format("YYYY-MM-DD"),
      remarks: remarks,
    };

    console.log(data);

    try {
      const result = await postData("/inventory-movements/", data);

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
          <Modal.Title>Agregar nuevo movimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex justify-content-evenly">
            <div className="d-flex flex-column textFieldsContainers">
              <Form.Group controlId="formMovement">
                <Form.Label>Movimiento</Form.Label>
                <Form.Control
                  as="select"
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  <option value="">Seleccionar tipo de movimiento</option>
                  <option value="IN">Entrada</option>
                  <option value="OUT">Salida</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formMovement">
                <Form.Label>Producto</Form.Label>
                <Form.Control
                  as="select"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((p) => (
                    <option value={p.product_id}>{p.product_name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formQuantity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formComentary">
                <Form.Label>Comentarios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Escribe tu comentario aquí"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="d-flex flex-column w-40 ContainerDatePicker">
              <Form.Label>Fecha del movimiento</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  value={movementDate}
                  onChange={(e) => setMovementDate(e)}
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

export default ModalFormInventoryMovement;
