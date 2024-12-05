// ProductTable.js
import React, { useState } from 'react';
import './ProductTable.css';
import { FaSyncAlt, FaPlus } from 'react-icons/fa'; // Importar los iconos necesarios
import NewProductForm from './NewProductForm';

const ProductTable = () => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const handleNewProductClick = () => {
    setShowNewProductForm(true);
  };

  const handleCloseForm = () => {
    setShowNewProductForm(false);
  };

  return (
    <div className="product-container">
      <h2>Almacén / Productos</h2>
      <div className="search-refresh">
        <input type="text" placeholder="input search text" className="search-input" />
        <div className="button-group">
          <button className="refresh-button">
            <FaSyncAlt /> Refrescar
          </button>
          <button className="new-button" onClick={handleNewProductClick}>
            <FaPlus /> Nuevo
          </button>
        </div>
      </div>
      
      {showNewProductForm ? (
        <NewProductForm onClose={handleCloseForm} />
      ) : (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>Producto_ID</th>
                <th>Nombre</th>
                <th>Código de Barra</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Fecha de Registro</th>
                <th>Fecha de Caducidad</th>
                <th>Category_ID</th>
                <th>Precio de Venta</th>
              </tr>
            </thead>
            <tbody>
              {/* Agrega aquí las filas de datos dinámicos */}
              <tr><td colSpan="9">Sin datos disponibles</td></tr>
            </tbody>
          </table>
          <div className="pagination">
            <button>Previous</button>
            <span className="page-numbers">1 2 3 ... 50</span>
            <button>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTable;
