// src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: itemId,
        quantity: newQuantity,
      },
    });
  };

  const handleRemoveItem = (itemId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: itemId,
    });
  };

  const handlePromoCode = async () => {
    setLoading(true);
    setPromoError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/${promoCode}`);
      const data = await response.json();

      if (data.valid) {
        dispatch({
          type: 'APPLY_PROMO',
          payload: {
            code: promoCode,
            discount: data.discount,
          },
        });
        setPromoCode('');
      } else {
        setPromoError('Invalid promo code');
      }
    } catch (error) {
      setPromoError('Error applying promo code');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {state.items.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                {item.selectedSize && (
                  <p className="item-size">Size: {item.selectedSize}</p>
                )}
                {item.selectedColor && (
                  <div className="item-color">
                    Color: 
                    <span 
                      className="color-dot"
                      style={{ backgroundColor: item.selectedColor }}
                    />
                  </div>
                )}
                <p className="item-price">${item.price}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => 
                    handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                  }
                  className="quantity-input"
                />
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                className="remove-item-btn"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totals.subtotal}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>${totals.shipping}</span>
          </div>
          
          <div className="summary-row">
            <span>Tax</span>
            <span>${totals.tax}</span>
          </div>

          {/* Promo Code */}
          <div className="promo-code">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              disabled={loading}
            />
            <button
              onClick={handlePromoCode}
              disabled={!promoCode || loading}
              className="apply-promo-btn"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}

          <div className="summary-total">
            <span>Total</span>
            <span>${totals.total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-btn"
            disabled={loading}
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;