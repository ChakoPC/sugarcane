// src/components/ProductList.js
import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;