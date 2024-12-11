// src/pages/ProductList.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { dispatch } = useCart();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products?` +
        `category=${selectedCategory}&sort=${sortBy}&` +
        `page=${currentPage}&limit=${productsPerPage}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchParams({ category });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading-spinner">Loading products...</div>;
  }

  return (
    <div className="product-list-page">
      {/* Filters Sidebar */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Categories</h3>
          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="products-main">
        {/* Sort Controls */}
        <div className="controls-bar">
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          <div className="products-count">
            Showing {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(Math.ceil(products.length / productsPerPage))].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === Math.ceil(products.length / productsPerPage)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

// Sample categories
const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Living',
  'Sports'
];

export default ProductList;