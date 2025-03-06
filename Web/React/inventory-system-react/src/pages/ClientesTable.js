// ClientesTable.js
import React, { useState } from 'react';
import NuevoCliente from './NuevoCliente';
import './ClientesTable.css';

const ClientesTable = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleNewClick = () => {
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
  };

  const handleAdd = () => {
    alert('Cliente agregado');
    setIsAddingNew(false);
  };

  return (
    <div className="clientes-table-container">
      {isAddingNew ? (
        <NuevoCliente onCancel={handleCancel} onAdd={handleAdd} />
      ) : (
        <>
          <header className="clientes-header">
            <h2 className="clientes-title">Cliente</h2>
            <div className="clientes-controls">
              <input type="text" placeholder="input search text" className="clientes-search-input" />
              <button className="clientes-search-button">🔍</button>
              <button className="clientes-refresh-button">Refrescar</button>
              <button className="clientes-new-button" onClick={handleNewClick}>+ Nuevo</button>
            </div>
          </header>

          <table className="clientes-table">
            <thead>
              <tr>
                <th>Cliente_ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Direccion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
              </tr>
            </tbody>
          </table>

          <footer className="clientes-footer">
            <button className="clientes-pagination-button">← Previo</button>
            <span className="clientes-pagination-page">1</span>
            <span className="clientes-pagination-page">2</span>
            <span className="clientes-pagination-page">3</span>
            <span className="clientes-pagination-page">...</span>
            <span className="clientes-pagination-page">67</span>
            <span className="clientes-pagination-page">68</span>
            <button className="clientes-pagination-button">Siguiente →</button>
          </footer>
        </>
      )}
    </div>
  );
};

export default ClientesTable;
