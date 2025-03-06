import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchData } from "../hooks/apiManager";

function ModalMostSalesReport({ startDate, endDate }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [mostSales, setMostSales] = useState([]);
  const [lessSales, setLessSales] = useState([]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Título y encabezado principal
    doc.setFontSize(18);
    doc.setTextColor(25, 25, 112);
    doc.text("Reporte de Artículos Vendidos", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Período: ${startDate} - ${endDate}`, 120, 20);
    doc.setDrawColor(200, 200, 200); // Color gris claro
    doc.line(10, 25, 200, 25); // Línea de izquierda a derecha (de orilla a orilla)
    // Columnas para las tablas
    const columns = [
      { header: "Id", dataKey: "product_id" },
      { header: "Descripcion", dataKey: "product_name" },
      { header: "Categoria", dataKey: "category" },
      { header: "Cantidad", dataKey: "quantity" },
      { header: "Total", dataKey: "total" },
    ];

    const startYPosition = 30; // Posición inicial para la primera tabla

    // Función para crear un título con fondo gris
    const createSectionTitle = (doc, title, yPosition) => {
      doc.setFillColor(200, 200, 200); // Color gris
      doc.rect(14, yPosition, 195, 10, "F"); // Rectángulo gris
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 16, yPosition + 7); // Título en negro dentro del rectángulo
    };

    // Tabla 1: Artículos Más Vendidos
    createSectionTitle(doc, "Artículos Más Vendidos", startYPosition);
    doc.autoTable({
      startY: startYPosition + 15,
      columns,
      body: mostSales,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { textColor: 0, fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 2 },
      tableWidth: "auto",
      columnStyles: {
        clave: { cellWidth: 25 },
        descripcion: { cellWidth: 70 },
        departamento: { cellWidth: 40 },
        categoria: { cellWidth: 40 },
        cantidad: { cellWidth: 20, halign: "right" },
      },
    });

    // Tabla 2: Artículos Menos Vendidos
    const secondTablePosition = doc.autoTable.previous.finalY + 20; // Espacio entre tablas
    createSectionTitle(doc, "Artículos Menos Vendidos", secondTablePosition);
    doc.autoTable({
      startY: secondTablePosition + 15,
      columns,
      body: lessSales,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { textColor: 0, fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 2 },
      tableWidth: "auto",
      columnStyles: {
        clave: { cellWidth: 25 },
        descripcion: { cellWidth: 70 },
        departamento: { cellWidth: 40 },
        categoria: { cellWidth: 40 },
        cantidad: { cellWidth: 20, halign: "right" },
      },
    });

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

    const blob = doc.output("blob");
    setPdfBlob(blob);
  };

  useEffect(() => {
    const getMostSale = async () => {
      const aux = await fetchData(
        `/order-details/top-selling/?start_date=${startDate}&end_date=${endDate}`
      );
      setMostSales(aux);
    };

    const getLessSale = async () => {
      const aux = await fetchData(
        `/order-details/less-selling/?start_date=${startDate}&end_date=${endDate}`
      );
      setLessSales(aux);
    };

    getLessSale();
    getMostSale();
  }, []);

  useEffect(() => {
    if (mostSales && lessSales) {
      generatePDF();
    }
  }, [mostSales, lessSales]);

  return (
    <div>
      {pdfBlob && (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
          title="Vista Previa del Reporte"
        ></iframe>
      )}
    </div>
  );
}

export default ModalMostSalesReport;
