// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar isAuthenticated={isAuthenticated} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>&copy; 2024 
            Sugarcane Corporation. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;