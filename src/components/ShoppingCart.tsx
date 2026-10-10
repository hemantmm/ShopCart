import React, { useState } from 'react';
import { Button, Offcanvas, Form, Row, Col } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { CartItem } from './CartItem';
import { formatCurrency } from '../utilities/formatCurrency';
import storeItems from '../data/items.json';
import { AVAILABLE_COUPONS, CouponDefinition } from '../data/coupons';
import {
  FiShoppingBag,
  FiArrowRight,
  FiLock,
  FiCheckCircle,
  FiTag,
  FiTruck,
  FiCreditCard,
  FiMapPin,
  FiMail
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)'),
  address: z
    .string()
    .trim()
    .min(1, 'Street address is required')
    .min(5, 'Street address must be at least 5 characters'),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .trim()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters'),
  zip: z
    .string()
    .trim()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits (e.g. 90210)'),
  cardNumber: z
    .string()
    .trim()
    .min(1, 'Card number is required')
    .refine((val) => {
      const clean = val.replace(/\D/g, '');
      return clean.length === 16;
    }, 'Card number must be 16 digits'),
  expirationDate: z
    .string()
    .trim()
    .min(1, 'Expiration date is required')
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format must be MM/YY')
    .refine((val) => {
      const clean = val.replace('/', '');
      if (clean.length < 4) return false;
      const month = parseInt(clean.substring(0, 2), 10);
      const year = parseInt('20' + clean.substring(2, 4), 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, 'Card expiration date has expired'),
  cvv: z
    .string()
    .trim()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

type ShoppingCartProps = {
  isOpen?: boolean;
};

export function ShoppingCart({ isOpen: isOpenProp }: ShoppingCartProps) {
  const { closeCart, cartItems, clearCart, cartQuantity, isCartOpen } = useShoppingCart();
  const isOpen = isOpenProp ?? isCartOpen;

  // Step state: 'cart' | 'checkout' | 'success'
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDefinition | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'danger' | 'info'; text: string } | null>(null);

  const [orderId, setOrderId] = useState('');
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    name: string;
    email: string;
    total: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    }
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((total, cartItem) => {
      const item = storeItems.find((i) => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const isCouponOrderMet = !appliedCoupon?.minOrder || subtotal >= appliedCoupon.minOrder;

  const calculateDiscount = () => {
    if (!appliedCoupon || !isCouponOrderMet) return 0;
    if (appliedCoupon.type === 'percent') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(subtotal, appliedCoupon.value);
    }
    if (appliedCoupon.type === 'shipping') {
      return Math.min(subtotal, appliedCoupon.value);
    }
    return 0;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e?: React.FormEvent, codeToApply?: string) => {
    if (e) e.preventDefault();
    const rawCode = codeToApply ?? promoInput;
    const cleanCode = rawCode.trim().toUpperCase();

    if (cleanCode === '') {
      setPromoMessage(null);
      setAppliedCoupon(null);
      return;
    }

    const matchedCoupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!matchedCoupon) {
      setPromoMessage({
        type: 'danger',
        text: 'Invalid promo code. Please tap an available coupon below.'
      });
      return;
    }

    if (matchedCoupon.minOrder && subtotal < matchedCoupon.minOrder) {
      const diff = matchedCoupon.minOrder - subtotal;
      setPromoMessage({
        type: 'danger',
        text: `${matchedCoupon.code} requires a minimum order of ${formatCurrency(matchedCoupon.minOrder)}. Add ${formatCurrency(diff)} more to apply!`
      });
      toast.warning(`${matchedCoupon.code} requires min. order of ${formatCurrency(matchedCoupon.minOrder)}`);
      return;
    }

    setAppliedCoupon(matchedCoupon);
    setPromoInput(matchedCoupon.code);

    const benefitText =
      matchedCoupon.type === 'percent'
        ? `${matchedCoupon.value}% discount applied!`
        : matchedCoupon.type === 'flat'
        ? `${formatCurrency(matchedCoupon.value)} discount applied!`
        : 'Free Express Delivery credit applied!';

    setPromoMessage({
      type: 'success',
      text: `🎉 ${matchedCoupon.code} applied! (${benefitText})`
    });

    toast.success(`Coupon ${matchedCoupon.code} applied! ${benefitText}`, {
      icon: <FiTag size={18} color="#4f46e5" />,
      autoClose: 2500,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoInput('');
    setPromoMessage({
      type: 'info',
      text: 'Coupon removed.'
    });
  };

  const handleSelectCoupon = (coupon: CouponDefinition) => {
    if (appliedCoupon?.code === coupon.code) {
      handleRemoveCoupon();
      return;
    }
    handleApplyPromo(undefined, coupon.code);
  };

  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formatted;
    setValue('cardNumber', formatted, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleExpirationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    e.target.value = digits;
    setValue('expirationDate', digits, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleCvvInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = digits;
    setValue('cvv', digits, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleZipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^\d-]/g, '').slice(0, 10);
    e.target.value = clean;
    setValue('zip', clean, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const onSubmitCheckout = (data: CheckoutFormData) => {
    const randomId = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setCompletedOrder({
      id: randomId,
      name: data.fullName,
      email: data.email,
      total: finalTotal
    });
    clearCart();
    setCurrentStep('success');
    toast.success(`🎉 Order ${randomId} confirmed! Receipt sent to ${data.email}`);
  };

  const handleClose = () => {
    closeCart();
    // Reset step after close if completed
    if (currentStep === 'success') {
      setTimeout(() => {
        setCurrentStep('cart');
        setAppliedCoupon(null);
        setPromoInput('');
        setPromoMessage(null);
        setCompletedOrder(null);
        reset();
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
              This demo order has been recorded. No payment was processed.
            </p>
            <div className="p-3 bg-light rounded-3 border mb-4 text-start">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Order Reference:</span>
                <strong className="text-primary font-monospace">{orderId}</strong>
              </div>
              {completedOrder && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-muted">Customer:</span>
                    <span className="fw-semibold text-dark text-truncate ms-2">{completedOrder.name}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-muted">Receipt Sent:</span>
                    <span className="fw-semibold text-dark text-truncate ms-2" style={{ maxWidth: '180px' }}>
                      {completedOrder.email}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small border-top pt-2 mt-2">
                    <span className="text-muted">Total Paid:</span>
                    <span className="fw-bold text-primary">{formatCurrency(completedOrder.total)}</span>
                  </div>
                </>
              )}
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
          <div className="d-flex flex-column flex-grow-1">
            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                className={`checkout-step-tab ${currentStep === 'cart' ? 'active' : ''}`}
                onClick={() => setCurrentStep('cart')}
              >
                1. Review Cart ({cartQuantity})
              </button>
              <button
                type="button"
                className={`checkout-step-tab ${currentStep === 'checkout' ? 'active' : ''}`}
                onClick={() => setCurrentStep('checkout')}
              >
                2. Shipping & Pay
              </button>
            </div>

            {currentStep === 'cart' && (
              <div className="d-flex flex-column flex-grow-1">
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '42vh', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <CartItem key={item.id} {...item} />
                  ))}
                </div>

                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-1 small fw-bold text-dark">
                      <FiTag className="text-primary" />
                      <span>Have a Promo Code?</span>
                    </div>
                    {appliedCoupon && (
                      <button
                        type="button"
                        className="btn btn-link p-0 text-danger small text-decoration-none fw-semibold"
                        style={{ fontSize: '0.78rem' }}
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <form onSubmit={(e) => handleApplyPromo(e)} className="promo-apply-group mb-2">
                    <label htmlFor="promo-code" className="visually-hidden">Promo code</label>
                    <Form.Control
                      id="promo-code"
                      size="sm"
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="text-uppercase fw-semibold"
                    />
                    <Button
                      size="sm"
                      variant={appliedCoupon ? "success" : "outline-primary"}
                      type="submit"
                      className="fw-bold px-3 text-nowrap"
                    >
                      {appliedCoupon ? "Applied ✓" : "Apply"}
                    </Button>
                  </form>

                  {promoMessage && (
                    <div
                      className={`small mb-2 fw-semibold ${
                        promoMessage.type === 'success'
                          ? 'text-success'
                          : promoMessage.type === 'info'
                          ? 'text-primary'
                          : 'text-danger'
                      }`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {promoMessage.text}
                    </div>
                  )}

                  <div className="pt-2 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small text-muted fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        AVAILABLE COUPONS (TAP TO APPLY)
                      </span>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" style={{ fontSize: '0.68rem' }}>
                        {AVAILABLE_COUPONS.length} offers
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2 available-coupons-list">
                      {AVAILABLE_COUPONS.map((coupon) => {
                        const isApplied = appliedCoupon?.code === coupon.code;
                        const isEligible = !coupon.minOrder || subtotal >= coupon.minOrder;

                        return (
                          <div
                            key={coupon.code}
                            className={`available-coupon-tag ${isApplied ? 'applied' : ''} ${!isEligible ? 'ineligible' : ''}`}
                            onClick={() => handleSelectCoupon(coupon)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectCoupon(coupon);
                              }
                            }}
                            title={
                              !isEligible
                                ? `Requires minimum order of ${formatCurrency(coupon.minOrder!)}`
                                : isApplied
                                ? `Click to remove ${coupon.code}`
                                : `Click to apply ${coupon.code}`
                            }
                          >
                            <div className="d-flex align-items-center justify-content-between w-100">
                              <div className="d-flex align-items-center gap-2">
                                <span className="coupon-code-badge font-monospace">
                                  <FiTag size={11} className="me-1" />
                                  {coupon.code}
                                </span>
                                <span className="coupon-benefit-pill">
                                  {coupon.label}
                                </span>
                              </div>
                              <div>
                                {isApplied ? (
                                  <span className="coupon-action-badge applied">
                                    Applied ✓
                                  </span>
                                ) : !isEligible ? (
                                  <span className="coupon-action-badge locked">
                                    Min. {formatCurrency(coupon.minOrder!)}
                                  </span>
                                ) : (
                                  <span className="coupon-action-badge apply-btn">
                                    Apply
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="coupon-desc text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                              {coupon.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="cart-summary-card mt-auto mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Subtotal</span>
                    <span className="fw-semibold text-dark">{formatCurrency(subtotal)}</span>
                  </div>

                  {appliedCoupon && (
                    isCouponOrderMet && discountAmount > 0 ? (
                      <div className="d-flex justify-content-between small text-success mb-1 fw-semibold">
                        <span className="d-flex align-items-center gap-1">
                          <FiTag size={13} />
                          <span>
                            {appliedCoupon.code} (
                            {appliedCoupon.type === 'percent'
                              ? `${appliedCoupon.value}%`
                              : appliedCoupon.type === 'flat'
                              ? formatCurrency(appliedCoupon.value)
                              : 'Free Delivery'}
                            )
                          </span>
                        </span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between small text-warning mb-1 fw-semibold">
                        <span className="d-flex align-items-center gap-1">
                          <FiTag size={13} />
                          <span>{appliedCoupon.code} (Needs {formatCurrency(appliedCoupon.minOrder!)})</span>
                        </span>
                        <span>$0.00</span>
                      </div>
                    )
                  )}

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span className="d-flex align-items-center gap-1">
                      <FiTruck size={14} className="text-primary" />
                      <span>Express Shipping</span>
                    </span>
                    {appliedCoupon?.code === 'FREESHIP' ? (
                      <span className="text-success fw-bold d-flex align-items-center gap-1">
                        <span className="text-decoration-line-through text-muted small" style={{ fontSize: '0.75rem' }}>$15.00</span>
                        <span>FREE</span>
                      </span>
                    ) : (
                      <span className="text-success fw-bold">FREE</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between fs-5 fw-bold text-dark border-top pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                  onClick={() => setCurrentStep('checkout')}
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight />
                </Button>
              </div>
            )}

            {currentStep === 'checkout' && (
              <Form onSubmit={handleSubmit(onSubmitCheckout)} noValidate className="d-flex flex-column flex-grow-1">
                <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 fw-bold small text-primary mb-2">
                      <FiMail />
                      <span>Contact & Receipt</span>
                    </div>
                    <Row className="g-2">
                      <Col xs={12}>
                        <Form.Group controlId="checkout-full-name">
                          <Form.Label className="small fw-semibold text-muted mb-1">Full Name</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="e.g. Alex Morgan"
                            {...register('fullName')}
                            isInvalid={!!errors.fullName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fullName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group controlId="checkout-email">
                          <Form.Label className="small fw-semibold text-muted mb-1">Email Address</Form.Label>
                          <Form.Control
                            size="sm"
                            type="email"
                            placeholder="e.g. alex@example.com"
                            {...register('email')}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 fw-bold small text-primary mb-2">
                      <FiMapPin />
                      <span>Shipping Address</span>
                    </div>
                    <Row className="g-2">
                      <Col xs={12}>
                        <Form.Group controlId="checkout-address">
                          <Form.Label className="small fw-semibold text-muted mb-1">Street Address</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="123 Main St, Apt 4B"
                            {...register('address')}
                            isInvalid={!!errors.address}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={5}>
                        <Form.Group controlId="checkout-city">
                          <Form.Label className="small fw-semibold text-muted mb-1">City</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="City"
                            {...register('city')}
                            isInvalid={!!errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={3}>
                        <Form.Group controlId="checkout-state">
                          <Form.Label className="small fw-semibold text-muted mb-1">State</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="State"
                            {...register('state')}
                            isInvalid={!!errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={4}>
                        <Form.Group controlId="checkout-zip">
                          <Form.Label className="small fw-semibold text-muted mb-1">ZIP Code</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="90210"
                            maxLength={10}
                            {...register('zip')}
                            onChange={handleZipInput}
                            isInvalid={!!errors.zip}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.zip?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2 fw-bold small text-primary">
                        <FiCreditCard />
                        <span>Payment Details</span>
                      </div>
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <FiLock size={12} className="text-success" />
                        Demo checkout
                      </span>
                    </div>
                    <Row className="g-2">
                      <Col xs={12}>
                        <Form.Group controlId="checkout-card-number">
                          <Form.Label className="small fw-semibold text-muted mb-1">Card Number (16 Digits)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            maxLength={19}
                            placeholder="4111 2222 3333 4444"
                            {...register('cardNumber')}
                            onChange={handleCardNumberInput}
                            isInvalid={!!errors.cardNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cardNumber?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group controlId="checkout-expiration-date">
                          <Form.Label className="small fw-semibold text-muted mb-1">Expires (MM/YY)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="MM / YY"
                            maxLength={5}
                            {...register('expirationDate')}
                            onChange={handleExpirationInput}
                            isInvalid={!!errors.expirationDate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.expirationDate?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group controlId="checkout-cvv">
                          <Form.Label className="small fw-semibold text-muted mb-1">CVV</Form.Label>
                          <Form.Control
                            size="sm"
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            {...register('cvv')}
                            onChange={handleCvvInput}
                            isInvalid={!!errors.cvv}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cvv?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="text-muted small d-block">Total Due:</span>
                      {appliedCoupon && isCouponOrderMet && discountAmount > 0 && (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '0.72rem' }}>
                          🏷️ {appliedCoupon.code} (-{formatCurrency(discountAmount)})
                        </span>
                      )}
                    </div>
                    <span className="fs-5 fw-bold text-primary">{formatCurrency(finalTotal)}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      type="button"
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
