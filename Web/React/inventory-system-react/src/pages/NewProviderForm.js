// NewProviderForm.js
import React, { useState } from 'react';
import './NewProviderForm.css';
import { FaTimes, FaTrashAlt, FaPlus } from 'react-icons/fa';

const NewProviderForm = ({ onClose }) => {
  const [providerData, setProviderData] = useState({
    providerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    registrationDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderData({ ...providerData, [name]: value });
  };

  const handleAdd = () => {
    console.log('Proveedor agregado:', providerData);
    onClose();
  };

  const handleClear = () => {
    setProviderData({
      providerName: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      registrationDate: '',
    });
  };

  return (
    <div className="new-provider-form">
      <h2>Proveedor Nuevo</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre Proveedor</label>
          <input type="text" name="providerName" value={providerData.providerName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fecha de Registro</label>
          <input
            type="date"
            name="registrationDate"
            value={providerData.registrationDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Contacto Persona</label>
          <input type="text" name="contactPerson" value={providerData.contactPerson} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" name="phone" value={providerData.phone} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Correo</label>
          <input type="email" name="email" value={providerData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input type="text" name="address" value={providerData.address} onChange={handleChange} />
        </div>
      </div>
      <div className="form-buttons">
        <button className="cancel-button" onClick={onClose}>
          <FaTimes /> Cancelar
        </button>
        <button className="clear-button" onClick={handleClear}>
          <FaTrashAlt /> Limpiar
        </button>
        <button className="add-button" onClick={handleAdd}>
          <FaPlus /> Agregar
        </button>
      </div>
    </div>
  );
};

export default NewProviderForm;

