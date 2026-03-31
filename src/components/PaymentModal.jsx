import React, { useState } from 'react';
import './PaymentModal.css';
import API_BASE_URL from '../config';

const PaymentModal = ({ isOpen, onClose, foodItem, user, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Card Details, 2: Processing, 3: Success
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !foodItem) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep(2);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const token = localStorage.getItem('accessToken');
      // Mocking the payment creation in the backend
      // In a real app, you'd use Razorpay/Stripe here
      const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(foodItem.price) * 100, // in cents/paise
          currency: 'INR',
          description: `Order for ${foodItem.name}`,
          status: 'paid',
          paymentMethod: 'credit_card',
          razorpayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
          razorpayPaymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
          userId: user?._id
        })
      });

      const data = await response.json();
      if (data.success) {
        setStep(3);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setStep(1);
        }, 2000);
      } else {
        alert(data.message || 'Payment failed recording');
        setStep(1);
      }
    } catch (err) {
      console.error('Payment record error:', err);
      // Fallback for demo if backend endpoint doesn't exist yet
      setStep(3);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep1 = () => (
    <div className="payment-form-container fade-in">
      <div className="clay-card preview-card">
        <div className="card-chip"></div>
        <div className="card-number">
          {cardData.number || '•••• •••• •••• ••••'}
        </div>
        <div className="card-info">
          <div className="card-holder">
            <span className="label">Card Holder</span>
            <span className="value">{cardData.name || 'FULL NAME'}</span>
          </div>
          <div className="card-expiry">
            <span className="label">Expires</span>
            <span className="value">{cardData.expiry || 'MM/YY'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePay} className="payment-fields">
        <div className="input-group">
          <label>Card Number</label>
          <input
            type="text"
            name="number"
            placeholder="0000 0000 0000 0000"
            value={cardData.number}
            onChange={handleInputChange}
            maxLength="16"
            required
          />
        </div>
        <div className="input-group">
          <label>Card Holder Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={cardData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="row">
          <div className="input-group">
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={handleInputChange}
              maxLength="5"
              required
            />
          </div>
          <div className="input-group">
            <label>CVV</label>
            <input
              type="password"
              name="cvv"
              placeholder="•••"
              value={cardData.cvv}
              onChange={handleInputChange}
              maxLength="3"
              required
            />
          </div>
        </div>
        <button type="submit" className="clay-btn pay-btn" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : `Pay ₹${foodItem.price}`}
        </button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="processing-container fade-in">
      <div className="spinner"></div>
      <p>Securely processing your payment...</p>
    </div>
  );

  const renderStep3 = () => (
    <div className="success-container fade-in">
      <div className="success-icon">✓</div>
      <h3>Payment Successful!</h3>
      <p>Your order for <strong>{foodItem.name}</strong> has been placed.</p>
    </div>
  );

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal-clay" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-header-clay">
          <h2>Secure Checkout</h2>
          <p>Complete your purchase for {foodItem.name}</p>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default PaymentModal;
