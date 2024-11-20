// InventoryTable.js
import React from 'react';
import './InventoryTable.css';

const InventoryTable = () => {
  return (
    <div className="inventory-container">
      <h2>Ventas / Inventario</h2>
      <div className="search-refresh">
        <input type="text" placeholder="input search text" className="search-input" />
        <div className="button-group">
          <button className="refresh-button">Refrescar</button>
        </div>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Mov_ID</th>
            <th>Tipo de Mov.</th>
            <th>Cantidad</th>
            <th>Fecha Mov.</th>
            <th>Comentarios</th>
            <th>Producto_ID</th>
          </tr>
        </thead>
        <tbody>
          {/* Agrega aquí las filas de datos dinámicos */}
          <tr><td colSpan="6">Sin datos disponibles</td></tr>
        </tbody>
      </table>
      <div className="pagination">
        <button>Previous</button>
        <span className="page-numbers">1 2 3 ... 67 68</span>
        <button>Next</button>
      </div>
    </div>
  );
};

export default InventoryTable;
