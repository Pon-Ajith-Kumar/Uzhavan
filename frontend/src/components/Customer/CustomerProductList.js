import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerProductList.css';

function CustomerProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Stored token:', token);

        let headers = { 'Content-Type': 'application/json' };

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

        console.log('Products response:', response);

        const sortedProducts = response.data.products.sort((a, b) => b.id - a.id);
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  const handleCreateOrder = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        toast.error('Authorization token is missing. Please log in again.');
        return;
      }

      await axios.post(
        'http://localhost:5000/create_order',
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Order created successfully!');

      // Remove the product from the list
      setProducts(products.filter(product => product.id !== productId));

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Error creating order: ${error.response?.data?.message || 'Internal Server Error'}`);
    }
  };

  return (
    <div className="customer-product-list-container">
      <h2>UZHAVAN STORE</h2>

      {error && <p className="error-message">{error}</p>}

      {products.length > 0 ? (
        <div className="product-list">

          {products
            .map(product => (
              <div key={product.id} className="product-card">
                
                <div className="image-container">
                  <img src={`/images/${product.image_path}`} alt={product.name} />
                </div>

                <h3>{product.name}</h3>
                <p className="product-id">ID: {product.id}</p>
                <p className="price">₹{product.price}</p>

                {/* Description */}
                <p>{product.description}</p>

                {/* Show stock */}
                {product.num_available !== null && product.num_available > 0 && (
                  <p className="stock">Stock: {product.num_available} units</p>
                )}

                {product.quantity_available !== null && product.quantity_available > 0 && (
                  <p className="stock">Stock: {product.quantity_available} {product.unit}</p>
                )}

                {/* Show Out of Stock or Create Order */}
                {(product.num_available === 0 || product.quantity_available === 0) ? (
                  <button disabled className="out-of-stock-btn">Out of Stock</button>
                ) : (
                  <button onClick={() => handleCreateOrder(product.id)}>Create Order</button>
                )}

              </div>
            ))
          }

        </div>
      ) : (
        <p>No products found.</p>
      )}

      <ToastContainer />
    </div>
  );
}

export default CustomerProductList;
