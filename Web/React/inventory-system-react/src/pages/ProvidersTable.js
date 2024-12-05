// ProvidersTable.js
import React, { useState } from 'react';
import './ProvidersTable.css';
import { FaSyncAlt, FaPlus } from 'react-icons/fa';
import NewProviderForm from './NewProviderForm';

const ProvidersTable = () => {
  const [showNewProviderForm, setShowNewProviderForm] = useState(false);

  const handleNewProviderClick = () => {
    setShowNewProviderForm(true);
  };

  const handleCloseForm = () => {
    setShowNewProviderForm(false);
  };

  return (
    <div className="providers-container">
      <h2>Almacén / Proveedores</h2>
      <div className="button-group">
        <button className="refresh-button">
          <FaSyncAlt /> Refrescar
        </button>
        <button className="new-button" onClick={handleNewProviderClick}>
          <FaPlus /> Nuevo
        </button>
      </div>

      {showNewProviderForm ? (
        <NewProviderForm onClose={handleCloseForm} />
      ) : (
        <>
          <table className="providers-table">
            <thead>
              <tr>
                <th>Proveedor_ID</th>
                <th>P. Nombre</th>
                <th>Contacto Persona</th>
                <th>Teléfono</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {/* Agrega aquí las filas de datos dinámicos */}
              <tr><td colSpan="5">Sin datos disponibles</td></tr>
            </tbody>
          </table>
          <div className="pagination">
            <button>Previo</button>
            <span className="page-numbers">1 2 3 ... 67 68</span>
            <button>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProvidersTable;

