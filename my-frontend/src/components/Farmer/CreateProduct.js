import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    // Ensure num_available and quantity_available/unit are mutually exclusive
    if (productDetails.num_available && (productDetails.quantity_available || productDetails.unit)) {
      toast.error("Please specify either 'Number Available' or 'Quantity Available' with 'Unit', but not both.", {
        autoClose: 8000, // Show for 8 seconds
        style: { width: '400px' } // Expand the width of the toast
      });
      return;
    }

    try {
      console.log('Sending product details:', JSON.stringify(productDetails));
      const response = await axios.post('http://localhost:5000/create_product', productDetails, config);
      console.log('Product created successfully:', response.data);
      toast.success('Product created successfully!', {
        autoClose: 8000, // Show for 8 seconds
        style: { width: '400px' } // Expand the width of the toast
      });
      setProductDetails({
        name: '',
        price: '',
        description: '',
        num_available: '',
        quantity_available: '',
        unit: ''
      });
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.response && error.response.data) {
        console.error('Response data:', error.response.data);
        toast.error(`Error: ${error.response.data.message}`, {
          autoClose: 5000, // Show for 5 seconds
          style: { width: '400px' } // Expand the width of the toast
        });
      } else {
        toast.error('Error creating product', {
          autoClose: 8000, // Show for 8 seconds
          style: { width: '400px' } // Expand the width of the toast
        });
      }
    }
  };

  return (
    <div className="create-product">
      <ToastContainer />
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
          onChange={(e) => {
            handleChange(e);
            if (e.target.value) {
              setProductDetails((prevState) => ({
                ...prevState,
                quantity_available: '',
                unit: ''
              }));
            }
          }}
          disabled={!!productDetails.quantity_available}
        />
        <label>Quantity Available:</label>
        <input
          type="number"
          name="quantity_available"
          value={productDetails.quantity_available}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value) {
              setProductDetails((prevState) => ({
                ...prevState,
                num_available: ''
              }));
            }
          }}
          disabled={!!productDetails.num_available}
        />
        <label>Unit:</label>
        <input
          type="text"
          name="unit"
          value={productDetails.unit}
          onChange={handleChange}
          disabled={!productDetails.quantity_available}
        />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;
