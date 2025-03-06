import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchData } from "../hooks/apiManager";

function ModalInventoryReport({ startDate, endDate }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [data, setData] = useState([]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(25, 25, 112);
    doc.text("Reporte de Movimientos de Inventario", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Período: ${startDate} - ${endDate}`, 140, 20);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 25, 200, 25);
    doc.setDrawColor(200, 200, 200); // Color gris claro
    doc.line(10, 25, 200, 25); // Línea de izquierda a derecha (de orilla a orilla)

    // Datos de la tabla principal
    const columns = [
      { header: "Producto", dataKey: "product_name" },
      { header: "Tipo de Movimiento", dataKey: "movement_type" },
      { header: "Fecha", dataKey: "movement_date" },
      { header: "Responsable", dataKey: "user" },
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
        const formattedDate = currentDate.toLocaleString();
        doc.text(
          formattedDate,
          doc.internal.pageSize.width - 50,
          doc.internal.pageSize.height - 10
        );
      },
    });

    const blob = doc.output("blob");
    setPdfBlob(blob);
  };

  useEffect(() => {
    const getData = async () => {
      const aux = await fetchData(
        `/inventory-movements/?start_date=${startDate}&end_date=${endDate}`
      );
      setData(aux);
    };

    getData();
  }, []);

  useEffect(() => {
    if (data) {
      generatePDF();
    }
  }, [data]);
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

export default ModalInventoryReport;
