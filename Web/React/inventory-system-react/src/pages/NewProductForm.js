// NewProductForm.js
import React, { useState } from 'react';
import './NewProductForm.css';
import { FaTimes, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Importar los iconos necesarios

const NewProductForm = ({ onClose }) => {
  const [productData, setProductData] = useState({
    name: '',
    barcode: '',
    price: '',
    quantity: '',
    salePrice: '',
    category: '',
    expirationDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleAdd = () => {
    // Aquí agregar lógica para agregar el producto
    console.log('Producto agregado:', productData);
    onClose();
  };

  const handleClear = () => {
    setProductData({
      name: '',
      barcode: '',
      price: '',
      quantity: '',
      salePrice: '',
      category: '',
      expirationDate: '',
    });
  };

  return (
    <div className="new-product-form">
      <h2>Captura de Productos Nuevos</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="name" value={productData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fecha de Registro</label>
          <input type="text" value="(fecha actual)" readOnly />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Código de Barra</label>
          <input type="text" name="barcode" value={productData.barcode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fecha de Caducidad</label>
          <input type="date" name="expirationDate" value={productData.expirationDate} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Precio</label>
          <input type="number" name="price" value={productData.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Cantidad</label>
          <input type="number" name="quantity" value={productData.quantity} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Precio de Venta</label>
          <input type="number" name="salePrice" value={productData.salePrice} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select name="category" value={productData.category} onChange={handleChange}>
            <option value="">Seleccionar</option>
            <option value="category1">Categoría 1</option>
            <option value="category2">Categoría 2</option>
            {/* Agrega más opciones de categoría según sea necesario */}
          </select>
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

export default NewProductForm;
