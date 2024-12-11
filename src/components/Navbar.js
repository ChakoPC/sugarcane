// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ isAuthenticated }) => {
  const { state } = useCart();
  const cartItemsCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
        Sugarcane Corporation</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-link">
          Cart ({cartItemsCount})
        </Link>
        {isAuthenticated ? (
          <button className="auth-button">Logout</button>
        ) : (
          <button className="auth-button">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;