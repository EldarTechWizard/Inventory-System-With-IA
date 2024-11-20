// NuevoCliente.js
import React from 'react';
import './NuevoCliente.css';

const NuevoCliente = ({ onCancel, onAdd }) => {
  return (
    <div className="nuevo-cliente-container">
      <h2 className="nuevo-cliente-title">Cliente Nuevo</h2>
      <form className="nuevo-cliente-form">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" placeholder="Ingrese el nombre" />
        </div>
        <div className="form-group">
          <label>Telefono</label>
          <input type="text" placeholder="Ingrese el teléfono" />
        </div>
        <div className="form-group">
          <label>Correo</label>
          <input type="email" placeholder="Ingrese el correo" />
        </div>
        <div className="form-group">
          <label>Direccion</label>
          <input type="text" placeholder="Ingrese la dirección" />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            ✖️ Cancelar
          </button>
          <button type="button" className="clear-button">
            🗑️ Limpiar
          </button>
          <button type="button" className="add-button" onClick={onAdd}>
            ➕ Agregar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoCliente;
