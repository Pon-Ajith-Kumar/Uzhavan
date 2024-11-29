import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FarmerProductList.css'; // Ensure you have the CSS file for styling

Modal.setAppElement('#root'); // Set the root element for accessibility

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
  const editFormRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct !== null) {
      editFormRef.current.focus();
    }
  }, [editingProduct]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/products/farmer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Response data:', response.data); // Log the response data
      const sortedProducts = response.data.products.sort((a, b) => b.id - a.id); // Sort products in descending order by ID
      setProducts(sortedProducts);
    } catch (error) {
      setError(error.message || 'Network Error');
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setProductDetails({
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      num_available: product.num_available || '',
      quantity_available: product.quantity_available || '',
      unit: product.unit || ''
    });
  };

  const handleUpdate = async () => {
    const updatedProductDetails = {
      id: productDetails.id,
      name: productDetails.name,
      description: productDetails.description,
      price: productDetails.price,
    };

    if (productDetails.num_available) {
      updatedProductDetails.num_available = productDetails.num_available;
    } else if (productDetails.quantity_available && productDetails.unit) {
      updatedProductDetails.quantity_available = productDetails.quantity_available;
      updatedProductDetails.unit = productDetails.unit;
    } else {
      toast.error('Please provide either Number Available or Quantity Available and Unit.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      console.log('Updating product with details:', updatedProductDetails); // Log product details
      await axios.put('http://localhost:5000/products/update', updatedProductDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
      toast.success('Product updated successfully!');
      fetchProducts();
    } catch (error) {
      setError(error.message || 'Network Error');
      if (error.response) {
        console.error('Server responded with:', error.response.data); // Log server response
        toast.error(`Failed to update product: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.error('Error updating product:', error); // Log the full error
      }
    }
  };

  const handleChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const getImageSrc = (imagePath) => {
    try {
      return require(`../../assets/images/${imagePath}`);
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="farmer-product-list">
      <ToastContainer />
      <h2>Your Products</h2>
      {error && <p>Error: {error}</p>}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                {product.image_path && getImageSrc(product.image_path) ? (
                  <img src={getImageSrc(product.image_path)} alt={product.name} />
                ) : (
                  <div className="placeholder-image">Image Not Available</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3> {/* Center the Product Name */}
                <p><strong>ID:</strong> {product.id}</p> {/* Displaying the Product ID */}
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Price:</strong> {product.price}</p>
                <p><strong>Number Available:</strong> {product.num_available || 0}</p>
                <p><strong>Quantity Available:</strong> {product.quantity_available || 0}</p>
                <p><strong>Unit:</strong> {product.unit || 'N/A'}</p>
                <div className="product-actions">
                  <button className="update-button" onClick={() => handleEdit(product)}>Update</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {editingProduct && (
        <div className="edit-form">
          <h3>Update Product</h3>
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={handleChange}
              ref={editFormRef}
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
            <label>Quantity Available:</label>
            <input
              type="number"
              name="quantity_available"
              value={productDetails.quantity_available}
              onChange={handleChange}
              disabled={!!productDetails.num_available} // Disable if num_available is provided
            />
            <label>Number Available:</label>
            <input
              type="number"
              name="num_available"
              value={productDetails.num_available}
              onChange={handleChange}
              disabled={!!productDetails.quantity_available} // Disable if quantity_available is provided
            />
            <label>Unit:</label>
            <input
              type="text"
              name="unit"
              value={productDetails.unit}
              onChange={handleChange}
              disabled={!!productDetails.num_available} // Disable if num_available is provided
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
