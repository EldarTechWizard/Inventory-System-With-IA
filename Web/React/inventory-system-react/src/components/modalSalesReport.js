import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchData } from "../hooks/apiManager";

function ModalSalesReport({ startDate, endDate }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(25, 25, 112);
    doc.text("Reporte General de Ventas", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Período: ${startDate} - ${endDate}`, 120, 20);
    doc.setDrawColor(200, 200, 200); // Color gris claro
    doc.line(10, 25, 200, 25); // Línea de izquierda a derecha (de orilla a orilla)

    // Datos de la tabla principal
    const columns = [
      { header: "Documento", dataKey: "document" },
      { header: "Fecha", dataKey: "order_date" },
      { header: "Folio", dataKey: "order_id" },
      { header: "Cliente", dataKey: "customer_name" },
      { header: "Usuario", dataKey: "username" },
      { header: "Est", dataKey: "is_active" },
      { header: "Total", dataKey: "total_amount" },
    ];

    // Generar la tabla principal con pie de página en cada página
    doc.autoTable({
      startY: 30,
      columns,
      body: data,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      bodyStyles: { textColor: 0 },
      styles: { fontSize: 10 },
      didDrawPage: function (data) {
        // Pie de página
        doc.setFontSize(8);
        doc.text(
          "Generado por SITE Control",
          14,
          doc.internal.pageSize.height - 10
        );
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString(); // Esto formatea la fecha y hora según la configuración regional
        doc.text(
          formattedDate,
          doc.internal.pageSize.width - 50,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Tabla de totales alineada a la derecha

    // Posición inicial para el encabezado de la tabla de totales
    const startY = doc.autoTable.previous.finalY + 10;

    // Encabezado para la tabla de totales
    doc.setFillColor(41, 128, 185); // Color azul
    const tableWidth = 100; // Ancho de la tabla de totales (ajústalo según el tamaño de la tabla)
    doc.rect(
      doc.internal.pageSize.width - tableWidth - 10,
      startY,
      tableWidth,
      10,
      "F"
    ); // Dibuja el fondo azul
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.text(
      "Totales por Forma de Pago",
      doc.internal.pageSize.width - tableWidth,
      startY + 7
    ); // Texto centrado dentro del rectángulo

    // Generar la tabla de totales
    doc.autoTable({
      startY: startY + 10, // Posiciona la tabla debajo del encabezado
      body: total,
      theme: "grid",
      margin: { left: doc.internal.pageSize.width - tableWidth - 10 }, // Ajusta el margen izquierdo para alinear la tabla a la derecha
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: "right" },
      },
      styles: { fontSize: 10 },
    });

    const blob = doc.output("blob");
    setPdfBlob(blob);
  };

  useEffect(() => {
    const getData = async () => {
      const aux = await fetchData(
        `/orders/?start_date=${startDate}&end_date=${endDate}`
      );

      setData(aux);

      // Calcular el total directamente aquí
      const totalAux = aux.reduce((total, item) => {
        return total + parseFloat(item.total_amount);
      }, 0);

      const totalFormatted = `$${totalAux.toFixed(2)}`;
      setTotal([
        ["Efectivo:", totalFormatted],
        ["Total:", totalFormatted],
      ]);
    };

    getData();
  }, []); // Solo depende de las fechas

  useEffect(() => {
    // Generar el PDF solo si `data` y `total` están completamente establecidos
    if (data && total) {
      generatePDF();
    }
  }, [data, total]);

  return (
    <div>
      {pdfBlob && (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{ width: "100%", height: "1000px", border: "1px solid #ccc" }}
          title="Vista Previa del Reporte"
        ></iframe>
      )}
    </div>
  );
}

export default ModalSalesReport;
