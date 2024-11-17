import React, { useState } from 'react';
import axios from 'axios';
import './CreateProduct.css'; // Ensure you have the CSS file for styling

function CreateProduct() {
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    num_available: '',
    quantity_available: '',
    unit: ''
  });

  const handleChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await axios.post('http://localhost:5000/api/create_product', productDetails, config);
    setProductDetails({
      name: '',
      price: '',
      description: '',
      num_available: '',
      quantity_available: '',
      unit: ''
    });
  };

  return (
    <div className="create-product">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={handleChange}
          required
        />
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={productDetails.price}
          onChange={handleChange}
          required
        />
        <label>Description:</label>
        <textarea
          name="description"
          value={productDetails.description}
          onChange={handleChange}
          required
        />
        <label>Number Available:</label>
        <input
          type="number"
          name="num_available"
          value={productDetails.num_available}
          onChange={handleChange}
        />
        <label>Quantity Available:</label>
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
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;
