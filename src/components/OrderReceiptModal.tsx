import React, { useState } from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import {
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiPrinter,
  FiCopy,
  FiCheck,
  FiRepeat,
  FiMapPin,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiClock,
  FiTag
} from 'react-icons/fi';
import { Order, OrderStatus } from '../types/order';
import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { toast } from 'react-toastify';

type OrderReceiptModalProps = {
  order: Order | null;
  show: boolean;
  onHide: () => void;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: string; icon: React.ReactNode; stepIndex: number }
> = {
  processing: {
    label: 'Processing',
    variant: 'warning',
    icon: <FiClock size={14} />,
    stepIndex: 1
  },
  dispatched: {
    label: 'Dispatched',
    variant: 'primary',
    icon: <FiPackage size={14} />,
    stepIndex: 2
  },
  in_transit: {
    label: 'In Transit',
    variant: 'info',
    icon: <FiTruck size={14} />,
    stepIndex: 3
  },
  delivered: {
    label: 'Delivered',
    variant: 'success',
    icon: <FiCheckCircle size={14} />,
    stepIndex: 4
  }
};

export function OrderReceiptModal({ order, show, onHide }: OrderReceiptModalProps) {
  const { increaseItemQuantity, openCart } = useShoppingCart();
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!order) return null;

  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
  const currentStep = statusInfo.stepIndex;

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      toast.success('Tracking number copied to clipboard!', { autoClose: 2000 });
      setTimeout(() => setCopiedTracking(false), 2500);
    } catch {
      toast.info(`Tracking: ${order.trackingNumber}`);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      increaseItemQuantity(item.id, item.selectedVariants, item.quantity);
    });
    toast.success(`Reordered ${order.items.length} item(s) from order ${order.id}!`, {
      icon: <FiRepeat size={18} color="#4f46e5" />,
      autoClose: 2500
    });
    onHide();
    openCart();
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const timelineSteps = [
    { label: 'Order Placed', desc: 'Payment verified & order queued', step: 1 },
    { label: 'Processing', desc: 'Picked & packed at logistics hub', step: 2 },
    { label: 'Dispatched', desc: `Handed over to ${order.carrier}`, step: 3 },
    { label: 'Delivered', desc: 'Package arrived at destination', step: 4 }
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="order-receipt-modal"
      contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
    >
      <Modal.Header closeButton className="border-bottom py-3 px-4 bg-light">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Badge bg="primary" className="font-monospace fs-6 px-3 py-2 rounded-pill">
            {order.id}
          </Badge>
          <Badge
            bg={statusInfo.variant}
            className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold text-uppercase"
            style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Badge>
          <span className="text-muted small d-none d-sm-inline">•</span>
          <span className="text-muted small d-none d-sm-inline d-flex align-items-center gap-1">
            <FiCalendar size={13} />
            <span>{formattedDate}</span>
          </span>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4 p-md-4">
        {/* Tracking Timeline */}
        <div className="order-tracking-card p-3 p-md-4 rounded-3 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                Carrier Tracking
              </div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <strong className="text-dark font-monospace" style={{ fontSize: '0.95rem' }}>
                  {order.trackingNumber}
                </strong>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0 px-2 rounded-pill d-inline-flex align-items-center gap-1"
                  style={{ fontSize: '0.72rem' }}
                  onClick={handleCopyTracking}
                  title="Copy tracking code"
                >
                  {copiedTracking ? <FiCheck size={11} className="text-success" /> : <FiCopy size={11} />}
                  <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-sm-end">
              <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                Est. Delivery
              </div>
              <div className="fw-bold text-primary mt-1" style={{ fontSize: '0.92rem' }}>
                {order.estimatedDelivery}
              </div>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="order-stepper-container">
            <div className="order-stepper-progress">
              <div
                className="order-stepper-fill"
                style={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
              />
            </div>
            <div className="order-stepper-nodes">
              {timelineSteps.map((s) => {
                const isComplete = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div key={s.step} className={`stepper-node ${isComplete ? 'complete' : ''} ${isCurrent ? 'active' : ''}`}>
                    <div className="node-dot">
                      {isComplete ? <FiCheck size={12} /> : s.step}
                    </div>
                    <div className="node-info">
                      <div className="node-label fw-bold">{s.label}</div>
                      <div className="node-desc text-muted">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Destination */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <div className="p-3 bg-light rounded-3 border h-100">
              <div className="d-flex align-items-center gap-2 small fw-bold text-primary mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                <FiMapPin size={15} />
                <span>Shipping Address</span>
              </div>
              <div className="fw-bold text-dark mb-1">{order.customer.fullName}</div>
              <div className="text-muted small mb-1">{order.customer.address}</div>
              <div className="text-muted small">
                {order.customer.city}, {order.customer.state} {order.customer.zip}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="p-3 bg-light rounded-3 border h-100">
              <div className="d-flex align-items-center gap-2 small fw-bold text-primary mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                <FiCreditCard size={15} />
                <span>Payment & Contact</span>
              </div>
              <div className="d-flex align-items-center gap-1 text-muted small mb-1">
                <FiMail size={13} className="text-secondary" />
                <span className="text-dark fw-semibold text-truncate">{order.customer.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted small mt-2">
                <span className="badge bg-secondary bg-opacity-10 text-dark border">
                  Card •••• {order.customer.cardLast4 || '4242'}
                </span>
                <span className="text-success small fw-semibold">✓ Paid Online</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Purchased Items List */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-3">Order Items ({order.items.length})</h6>
          <div className="d-flex flex-column gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 border bg-light bg-opacity-50"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="rounded-2 border bg-white p-1"
                    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                  />
                  <div>
                    <div className="fw-bold text-dark text-capitalize" style={{ fontSize: '0.9rem' }}>
                      {item.name}
                    </div>
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="d-flex align-items-center gap-1 flex-wrap my-1">
                        {Object.entries(item.selectedVariants).map(([type, val]) => (
                          <span
                            key={type}
                            className="badge bg-white text-secondary border small py-0 px-2 text-capitalize"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {type}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-muted small">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>
                <div className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown Card */}
        <div className="p-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between text-muted small mb-2">
            <span>Items Subtotal:</span>
            <span className="fw-semibold text-dark">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="d-flex justify-content-between text-success small mb-2 fw-semibold">
              <span className="d-flex align-items-center gap-1">
                <FiTag size={13} />
                <span>Promo Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
              </span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between text-muted small mb-2">
            <span className="d-flex align-items-center gap-1">
              <FiTruck size={14} className="text-primary" />
              <span>Express Delivery ({order.carrier}):</span>
            </span>
            <span className={order.shippingCost === 0 ? 'text-success fw-bold' : 'fw-semibold text-dark'}>
              {order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}
            </span>
          </div>
          <div className="d-flex justify-content-between fs-5 fw-bold text-dark border-top pt-2 mt-2">
            <span>Total Paid:</span>
            <span className="text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top py-3 px-4 d-flex align-items-center justify-content-between bg-light flex-wrap gap-2">
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill px-3 d-inline-flex align-items-center gap-1"
            onClick={handlePrint}
          >
            <FiPrinter size={14} />
            <span>Print Receipt</span>
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3 d-inline-flex align-items-center gap-1"
            onClick={handleReorder}
          >
            <FiRepeat size={14} />
            <span>Reorder Items</span>
          </Button>
        </div>

        <Button variant="secondary" size="sm" className="rounded-pill px-4" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

