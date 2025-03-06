// DateRangePicker.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PreviewSection from './PreviewSection'; // Importa el componente de vista previa
import './DateRangePicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DateRangePicker = ({ reportTitle, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPreview, setIsPreview] = useState(false); // Estado para manejar la vista previa

  // Funciones de manejo de cambio de fecha
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null); // Limpiar la fecha de fin si la fecha de inicio es posterior
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handlePreviewClick = () => {
    setIsPreview(true); // Cambia a vista previa al hacer clic en "Vista previa"
  };

  if (isPreview) {
    return <PreviewSection onBack={() => setIsPreview(false)} />;
  }

  return (
    <div className="date-range-picker">
      <h2>{reportTitle}</h2>
      <p>Seleccione el Periodo deseado</p>
      <hr />

      <div className="date-picker-container">
        <div className="date-picker">
          <label>Fecha de Inicio</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsStart
            inline
          />
        </div>
        <div className="date-picker">
          <label>Fecha Fin</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            selectsEnd
            inline
          />
        </div>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={onClose}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <button className="preview-button" onClick={handlePreviewClick}>
          <FontAwesomeIcon icon={faFileAlt} /> Vista previa
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
