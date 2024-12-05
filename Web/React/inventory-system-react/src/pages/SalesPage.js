import React, { useState } from 'react';
import './SalesPage.css';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const SalesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState(Array(10).fill(1));
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Productos organizados por categoría
  const productCategories = {
    cosmeticos: ['Avon', 'Loreal', 'Nivea', 'Maybelline'],
    bebidas: ['CocaCola', 'Pepsi', 'Sprite', 'Fanta'],
    alimentos: ['Lays', 'Doritos', 'Cheetos', 'Ruffles'],
    ropa: ['Camiseta', 'Pantalón', 'Sudadera', 'Zapatos']
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setFilteredProducts(productCategories[category] || []);
  };

  const handleQuantityChange = (index, action) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (action === 'increase') {
        newQuantities[index] += 1;
      } else if (action === 'decrease' && newQuantities[index] > 1) {
        newQuantities[index] -= 1;
      }
      return newQuantities;
    });
  };

  return (
    <div className="sales-page">
      {/* Tabla de productos */}
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Artículo</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quantities.map((quantity, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>Producto {index + 1}</td>
                <td>$10.00</td>
                <td className="quantity-cell">
                  <button onClick={() => handleQuantityChange(index, 'decrease')}><FaMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 'increase')}><FaPlus /></button>
                </td>
                <td>${(quantity * 10).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de controles y total */}
      <div className="controls-container">
        <select className="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Seleccionar categoría</option>
          <option value="cosmeticos">Cosméticos</option>
          <option value="bebidas">Bebidas</option>
          <option value="alimentos">Alimentos</option>
          <option value="ropa">Ropa</option>
        </select>
        <button className="cancel-btn"><FaTrash /> Borrar</button>
        <button className="confirm-btn">Confirmar</button>
        <div className="total-container">
          <span className="total-text">Total:</span>
          <input type="text" className="total-input" readOnly value={`$${(quantities.reduce((acc, qty) => acc + qty, 0) * 10).toFixed(2)}`} />
        </div>
      </div>

      {/* Sección de productos */}
      <div className="products-container">
        {filteredProducts.map((product, index) => (
          <button key={index} className="product-button">{product}</button>
        ))}
      </div>
    </div>
  );
};

export default SalesPage;
