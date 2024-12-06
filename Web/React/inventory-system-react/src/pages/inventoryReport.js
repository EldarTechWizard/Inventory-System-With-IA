import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  ModalBody,
} from "react-bootstrap";
import "../styles/report.css";
import ModalInventoryReport from "../components/modalInventoryReport";
function InventoryReport() {
  const [dateLimitLeft, setDateLimitLeft] = useState(
    dayjs(new Date("2024-01-02"))
  );
  const [dateLimitRight, setDateLimitRight] = useState(dayjs(new Date()));
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="d-flex p-2 flex-column align-items-center">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className=""
      >
        <Modal.Header closeButton>
          <Modal.Title>Reporte generado</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <ModalInventoryReport
            startDate={dateLimitLeft.format("YYYY-MM-DD")}
            endDate={dateLimitRight.format("YYYY-MM-DD")}
          />
        </ModalBody>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose} className="mx-2">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="px-5 w-100">
        <h2 className="text-center ">Reporte de inventarios</h2>
        <h6 className="fs-sm w-100 border-bottom border-secondary mt-3 py-3 text-center text-body-secondary">
          Seleccione el periodo deseado
        </h6>
        <div className="d-flex pt-4 justify-content-evenly">
          <Form.Group controlId="formLeftLimitDate">
            <Form.Label>Fecha de Inicio</Form.Label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                value={dateLimitLeft}
                onChange={(e) => setDateLimitLeft(e)}
                slotProps={{
                  actionBar: {
                    actions: [""],
                  },
                }}
              />
            </LocalizationProvider>
          </Form.Group>
          <Form.Group controlId="formrnDate">
            <Form.Label>Fecha Fin</Form.Label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                value={dateLimitRight}
                onChange={(e) => setDateLimitRight(e)}
                slotProps={{
                  actionBar: {
                    actions: [""],
                  },
                }}
              />
            </LocalizationProvider>
          </Form.Group>
        </div>
        <div className="d-flex w-100 justify-content-end footerContainer">
          <Button onClick={handleShow}>Vista previa</Button>
        </div>
      </div>
    </div>
  );
}

export default InventoryReport;
