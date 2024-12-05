// PreviewSection.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import './PreviewSection.css';

const PreviewSection = ({ onBack }) => {
  return (
    <div className="preview-section">
      <div className="preview-content">
        <div className="report-placeholder">
          {/* Aquí puedes agregar el contenido dinámico del reporte en lugar de este marcador de posición */}
          <p>Contenido del reporte</p>
        </div>
      </div>
      <div className="button-container">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <button className="save-button">
          <FontAwesomeIcon icon={faSave} /> Descargar
        </button>
      </div>
    </div>
  );
};

export default PreviewSection;
