import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AuthContext from "../context/authContext";
import "../styles/products.css";
import ModalFormProduct from "../components/formProduct";

function Rows({ product }) {
  return (
    <tr>
      <th>{product.product_id}</th>
      <th>{product.product_name}</th>
      <th>{product.barcode}</th>
      <th>{product.unit_price}</th>
      <th>{product.units_in_stock}</th>
    </tr>
  );
}

function Products() {
  let { authTokens } = useContext(AuthContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = "http://127.0.0.1:8000/api/products";
    const token = `Bearer ${authTokens.access}`;

    async function fetchData() {
      try {
        // Perform GET request with Bearer token in headers
        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setProducts(response.data);
      } catch (error) {
        // Handle errors
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:", error.request);
        } else {
          // Something happened setting up the request
          console.error("Error setting up request:", error.message);
        }
      }
    }

    fetchData();
  }, [authTokens]);

  return (
    <div id="products" className="d-flex m-2 bg-white border p-2 flex-column">
      <div className="d-flex border border-primary w-100 p-2">
        <ModalFormProduct />
      </div>

      <div className="border border-secondary w-100 p-2">
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Codigo de barra</th>
              <th>Precio</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <Rows product={p} />
            ))}
          </tbody>
        </Table>
      </div>
      <div></div>
    </div>
  );
}

export default Products;
