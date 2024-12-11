// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setSelectedSize(data.sizes[0]);
      setSelectedColor(data.colors[0]);
      fetchRelatedProducts(data.category);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products/related?category=${category}&exclude=${id}`
      );
      const data = await response.json();
      setRelatedProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity,
        selectedSize,
        selectedColor,
      },
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="primary-image"
            />
          </div>
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">${product.price}</div>
          
          {/* Product Rating */}
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < product.rating ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="review-count">({product.reviewCount} reviews)</span>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Color Selection */}
          <div className="color-selection">
            <h3>Color</h3>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`color-option ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="size-selection">
            <h3>Size</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="quantity-selection">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {/* Product Details */}
          <div className="product-details">
            <h3>Product Details</h3>
            <ul>
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <Link
              to={`/product/${relatedProduct._id}`}
              key={relatedProduct._id}
              className="related-product-card"
            >
              <img src={relatedProduct.images[0]} alt={relatedProduct.name} />
              <h3>{relatedProduct.name}</h3>
              <p className="related-product-price">${relatedProduct.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;