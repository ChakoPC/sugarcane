// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',

    // Billing Information
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  const calculateTotals = () => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const validateForm = () => {
    const errors = {};
    
    // Shipping validation
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.zipCode) errors.zipCode = 'ZIP code is required';
    
    // Payment validation
    if (!formData.cardName) errors.cardName = 'Name on card is required';
    if (!formData.cardNumber) errors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) errors.cvv = 'CVV is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 16) {
      setFormData(prev => ({
        ...prev,
        cardNumber: formatCardNumber(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          billing: formData.sameAsShipping
            ? null
            : {
                address: formData.billingAddress,
                city: formData.billingCity,
                state: formData.billingState,
                zipCode: formData.billingZipCode,
              },
          payment: {
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          },
          totals: calculateTotals(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        navigate('/order-confirmation', { state: { orderId: data.orderId } });
      } else {
        setError(data.message || 'An error occurred during checkout');
      }
    } catch (error) {
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Shipping Information */}
          <section className="form-section">
            <h2>Shipping Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? 'error' : ''}
                />
                {formErrors.firstName && (
                  <span className="error-message">{formErrors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? 'error' : ''}
                />
                {formErrors.lastName && (
                  <span className="error-message">{formErrors.lastName}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && (
                  <span className="error-message">{formErrors.address}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? 'error' : ''}
                />
                {formErrors.city && (
                  <span className="error-message">{formErrors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? 'error' : ''}
                />
                {formErrors.state && (
                  <span className="error-message">{formErrors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={formErrors.zipCode ? 'error' : ''}
                />
                {formErrors.zipCode && (
                  <span className="error-message">{formErrors.zipCode}</span>
                )}
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="form-section">
            <h2>Payment Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={formErrors.cardName ? 'error' : ''}
                />
                {formErrors.cardName && (
                  <span className="error-message">{formErrors.cardName}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  className={formErrors.cardNumber ? 'error' : ''}
                />
                {formErrors.cardNumber && (
                  <span className="error-message">{formErrors.cardNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={formErrors.expiryDate ? 'error' : ''}
                />
                {formErrors.expiryDate && (
                  <span className="error-message">{formErrors.expiryDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  maxLength="4"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={formErrors.cvv ? 'error' : ''}
                />
                {formErrors.cvv && (
                  <span className="error-message">{formErrors.cvv}</span>
                )}
              </div>
            </div>
          </section>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${totals.total}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {state.items.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="item-info">
                  <img src={item.imageUrl} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    {item.selectedColor && (
                      <div className="color-info">
                        Color: 
                        <span 
                          className="color-dot"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
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
            <div className="summary-total">
              <span>Total</span>
              <span>${totals.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;