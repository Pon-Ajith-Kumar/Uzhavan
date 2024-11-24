import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FarmerProductList.css'; // Ensure you have the CSS file for styling

Modal.setAppElement('#root'); // Set the root element for accessibility

function FarmerProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // State to track the product to delete
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
      console.log('Response data:', response.data); // Log the response data
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
      await axios.put('http://localhost:5000/products/update', productDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
      toast.success('Product updated successfully!'); // Show success message
      fetchProducts();
    } catch (error) {
      setError(error.message || 'Network Error');
      console.error('Error updating product:', error);
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete('http://localhost:5000/products/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: productToDelete }
      });
      setProductToDelete(null);
      toast.success('Product deleted successfully!'); // Show success message
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
                  <button className="delete-button" onClick={() => confirmDelete(product.id)}>Delete</button>
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
            />
            <label>Number Available:</label>
            <input
              type="number"
              name="num_available"
              value={productDetails.num_available}
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

      {/* Confirmation Modal for Deleting Product */}
      <Modal
        isOpen={!!productToDelete}
        onRequestClose={() => setProductToDelete(null)}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="modal-actions">
          <button onClick={() => handleDelete()}>Yes</button>
          <button onClick={() => setProductToDelete(null)}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default FarmerProductList;
