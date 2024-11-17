import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FarmerProductList.css'; // Ensure you have the CSS file for styling

function FarmerProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    num_available: '',
    quantity_available: '',
    unit: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/products/farmer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      setError(error.message || 'Network Error');
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setProductDetails(product);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:5000/api/products/update', productDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setError(error.message || 'Network Error');
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete('http://localhost:5000/api/products/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: productId }
      });
      fetchProducts();
    } catch (error) {
      setError(error.message || 'Network Error');
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="farmer-product-list">
      <h2>Your Products</h2>
      {error && <p>Error: {error}</p>}
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Available</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity_available || product.num_available}</td>
                <td>{product.unit || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}

      {editingProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={handleChange}
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={productDetails.description}
              onChange={handleChange}
            />
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={productDetails.price}
              onChange={handleChange}
            />
            <label>Available:</label>
            <input
              type="number"
              name="quantity_available"
              value={productDetails.quantity_available}
              onChange={handleChange}
            />
            <label>Unit:</label>
            <input
              type="text"
              name="unit"
              value={productDetails.unit}
              onChange={handleChange}
            />
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
            <button type="button" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default FarmerProductList;
