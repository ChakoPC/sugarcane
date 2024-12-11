// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/featured`);
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 4));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Sugarcane Corporation</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <Link to={`/product/${product._id}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="special-offers">
        <div className="offer-content">
          <h2>Special Offers</h2>
          <p>Get 20% off on your first purchase!</p>
          <Link to="/products" className="offer-button">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

// Sample categories data
const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', icon: '🖥️' },
  { id: 2, name: 'Clothing', slug: 'clothing', icon: '👕' },
  { id: 3, name: 'Home & Living', slug: 'home-living', icon: '🏠' },
  { id: 4, name: 'Books', slug: 'books', icon: '📚' }
];

export default Home;