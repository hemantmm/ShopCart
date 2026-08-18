import React, { useState } from 'react';
import { Button, Offcanvas, Form, Row, Col } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { CartItem } from './CartItem';
import { formatCurrency } from '../utilities/formatCurrency';
import storeItems from '../data/items.json';
import {
  FiShoppingBag,
  FiArrowRight,
  FiLock,
  FiCheckCircle,
  FiTag,
  FiTruck,
  FiCreditCard,
  FiMapPin
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems, clearCart, cartQuantity } = useShoppingCart();

  // Step state: 'cart' | 'checkout' | 'success'
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });

  const [orderId, setOrderId] = useState('');

  const calculateSubtotal = () => {
    return cartItems.reduce((total, cartItem) => {
      const item = storeItems.find((i) => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    if (cleanCode === 'SHOPCART15') {
      setDiscountPercent(15);
      setPromoMessage({ type: 'success', text: '15% VIP Discount applied successfully!' });
    } else if (cleanCode === '') {
      setPromoMessage(null);
    } else {
      setPromoMessage({ type: 'danger', text: 'Invalid promo code. Try "SHOPCART15".' });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    clearCart();
    setCurrentStep('success');
  };

  const handleClose = () => {
    closeCart();
    // Reset step after close if completed
    if (currentStep === 'success') {
      setTimeout(() => {
        setCurrentStep('cart');
        setDiscountPercent(0);
        setPromoInput('');
        setPromoMessage(null);
      }, 400);
    }
  };

  return (
    <Offcanvas
      show={isOpen}
      onHide={handleClose}
      placement="end"
      className="cart-offcanvas-custom"
    >
      <Offcanvas.Header closeButton className="border-bottom py-3">
        <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold fs-5">
          <FiShoppingBag className="text-primary" size={22} />
          <span>Shopping Cart</span>
          {cartQuantity > 0 && (
            <span className="badge bg-primary rounded-pill small px-2 py-1">
              {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'}
            </span>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-3">
        {/* SUCCESS SCREEN */}
        {currentStep === 'success' ? (
          <div className="text-center my-auto py-4">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}
            >
              <FiCheckCircle />
            </div>
            <h4 className="fw-bold text-dark mb-2">Order Confirmed!</h4>
            <p className="text-muted small mb-3">
              Thank you for shopping with ShopCart. Your payment has been processed and your order is being prepared.
            </p>
            <div className="p-3 bg-light rounded-3 border mb-4">
              <span className="text-muted small d-block mb-1">Order Reference Number</span>
              <strong className="text-primary fs-5">{orderId}</strong>
            </div>
            <Button
              variant="primary"
              className="w-100 py-2 rounded-pill fw-bold"
              onClick={handleClose}
            >
              Continue Shopping
            </Button>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART SCREEN */
          <div className="text-center my-auto py-5">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f1f5f9',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.75rem'
              }}
            >
              <FiShoppingBag />
            </div>
            <h5 className="fw-bold text-dark mb-1">Your cart is empty</h5>
            <p className="text-muted small mb-4">
              Looks like you haven't added any gear yet. Explore our curated collections to get started!
            </p>
            <Link to="/store" onClick={handleClose} className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
              Browse Store Collection
            </Link>
          </div>
        ) : (
          /* ACTIVE CART & CHECKOUT FLOW */
          <div className="d-flex flex-column flex-grow-1">
            {/* Step Selector Tabs */}
            <div className="d-flex gap-2 mb-3">
              <button
                className={`checkout-step-tab ${currentStep === 'cart' ? 'active' : ''}`}
                onClick={() => setCurrentStep('cart')}
              >
                1. Review Cart ({cartQuantity})
              </button>
              <button
                className={`checkout-step-tab ${currentStep === 'checkout' ? 'active' : ''}`}
                onClick={() => setCurrentStep('checkout')}
              >
                2. Shipping & Pay
              </button>
            </div>

            {/* STEP 1: REVIEW CART */}
            {currentStep === 'cart' && (
              <div className="d-flex flex-column flex-grow-1">
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '42vh', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <CartItem key={item.id} {...item} />
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex align-items-center gap-1 small fw-bold text-dark mb-2">
                    <FiTag className="text-primary" />
                    <span>Have a Promo Code?</span>
                  </div>
                  <form onSubmit={handleApplyPromo} className="promo-apply-group">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="e.g. SHOPCART15"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <Button size="sm" variant="outline-primary" type="submit" className="fw-bold px-3">
                      Apply
                    </Button>
                  </form>
                  {promoMessage && (
                    <div
                      className={`small mt-2 fw-semibold ${
                        promoMessage.type === 'success' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {promoMessage.text}
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="cart-summary-card mt-auto mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Subtotal</span>
                    <span className="fw-semibold text-dark">{formatCurrency(subtotal)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="d-flex justify-content-between small text-success mb-1 fw-semibold">
                      <span>VIP Promo ({discountPercent}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span className="d-flex align-items-center gap-1">
                      <FiTruck size={14} className="text-primary" />
                      <span>Express Shipping</span>
                    </span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>

                  <div className="d-flex justify-content-between fs-5 fw-bold text-dark border-top pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                  onClick={() => setCurrentStep('checkout')}
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight />
                </Button>
              </div>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {currentStep === 'checkout' && (
              <Form onSubmit={handleCheckoutSubmit} className="d-flex flex-column flex-grow-1">
                <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {/* Shipping Section */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 fw-bold small text-primary mb-2">
                      <FiMapPin />
                      <span>Shipping Address</span>
                    </div>
                    <Row className="g-2">
                      <Col xs={12}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="Full Name"
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        />
                      </Col>
                      <Col xs={12}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="Street Address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        />
                      </Col>
                      <Col xs={5}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="City"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        />
                      </Col>
                      <Col xs={3}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="State"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="ZIP Code"
                          value={shippingInfo.zip}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2 fw-bold small text-primary">
                        <FiCreditCard />
                        <span>Payment Details</span>
                      </div>
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <FiLock size={12} className="text-success" />
                        256-bit Encrypted
                      </span>
                    </div>
                    <Row className="g-2">
                      <Col xs={12}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          maxLength={19}
                          placeholder="Card Number (16 Digits)"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          size="sm"
                          required
                          type="text"
                          placeholder="MM / YY"
                          maxLength={5}
                          value={paymentDetails.expirationDate}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          size="sm"
                          required
                          type="password"
                          placeholder="CVV"
                          maxLength={4}
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Final Total and Submit */}
                <div className="mt-auto pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">Total Due:</span>
                    <span className="fs-5 fw-bold text-primary">{formatCurrency(finalTotal)}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setCurrentStep('cart')}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                    >
                      <FiLock size={15} />
                      <span>Pay {formatCurrency(finalTotal)}</span>
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
