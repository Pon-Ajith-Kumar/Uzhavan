import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar'; // Corrected path to Navbar
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        let headers = {
          'Content-Type': 'application/json'
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
          console.log('Authorization header set:', headers.Authorization);
        } else {
          console.log('No Authorization header set');
        }

        const response = await axios.get('http://localhost:5000/products/list', {
          headers: headers,
          withCredentials: true
        });

        const sortedProducts = response.data.products.sort((a, b) => b.id - a.id); // Sort products in descending order based on ID
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <Navbar />
      <h2>UZHAVAN STORE</h2>
      <div className="marquee-container">
        <div className="marquee">Login to view the complete features of Uzhavan!</div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {products.length > 0 ? (
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                <img src={`/images/${product.image_path}`} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p className="product-id">ID: {product.id}</p>
              <p className="price">₹{product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductList;
