import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchData } from "../hooks/apiManager";

function ModalSalesReport({ startDate, endDate }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [expenses, setExpense] = useState(null);
  const [gains, setGains] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const [sellTotal, setSellTotal] = useState(null);
  const [expensesTotal, setExpensesTotal] = useState(null);

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

    const startY = doc.autoTable.previous.finalY + 10;
    doc.setFillColor(41, 128, 185);
    const tableWidth = 80;
    doc.rect(
      doc.internal.pageSize.width - tableWidth - 10,
      startY,
      tableWidth,
      10,
      "F"
    );
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Totales por Forma de Pago",
      doc.internal.pageSize.width - 73,
      startY + 7
    );
    doc.autoTable({
      startY: startY + 10,
      body: total,
      theme: "grid",
      margin: { left: 120 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: "right" },
      },
      styles: { fontSize: 10 },
    });

    doc.rect(14, startY, tableWidth, 10, "F");
    doc.setFontSize(10);
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.text("Gastos por Forma de Pago", 30, startY + 7);
    doc.autoTable({
      startY: startY + 10,
      body: expenses,
      theme: "grid",
      margin: { left: 14 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: "right" },
      },
      styles: { fontSize: 10 },
    });

    const startY2 = startY + 32;

    doc.rect(
      doc.internal.pageSize.width - tableWidth - 10,
      startY2,
      tableWidth,
      10,
      "F"
    );
    doc.setFontSize(10);
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Ganancias por periodo",
      doc.internal.pageSize.width - 73,
      startY2 + 7
    );

    doc.autoTable({
      startY: startY2 + 10,
      body: gains,
      theme: "grid",
      margin: { left: 120 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: "right" },
      },
      styles: { fontSize: 10 },
    });

    const blob = doc.output("blob");
    setPdfBlob(blob);
  };

  const getData = async () => {
    const aux = await fetchData(
      `/orders/?start_date=${startDate}&end_date=${endDate}`
    );

    setData(aux);

    const totalAux = aux.reduce((total, item) => {
      return total + parseFloat(item.total_amount);
    }, 0);

    setSellTotal(totalAux);

    const totalFormatted = `$${totalAux.toFixed(2)}`;
    setTotal([
      ["Efectivo:", totalFormatted],
      ["Total:", totalFormatted],
    ]);
  };

  const getExpenses = async () => {
    const aux = await fetchData(
      `/expenses/?start_date=${startDate}&end_date=${endDate}`
    );

    const totalAux = aux.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);

    setExpensesTotal(totalAux);

    const totalFormatted = `$${totalAux.toFixed(2)}`;

    setExpense([
      ["Efectivo", totalFormatted],
      ["Total", totalFormatted],
    ]);
  };

  useEffect(() => {
    getData();
    getExpenses();
  }, []);

  useEffect(() => {
    if (data && total && expenses) {
      const gains = sellTotal - expensesTotal;
      setGains([
        ["Vendido", `$${sellTotal}`],
        ["Gastos", `$${expensesTotal}`],
        ["Total", `$${gains.toFixed(2)}`],
      ]);

      generatePDF();
    }
  }, [data, total, expenses]);

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
