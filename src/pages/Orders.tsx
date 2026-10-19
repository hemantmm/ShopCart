import { useState, useMemo, useEffect } from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRepeat,
  FiCalendar
} from 'react-icons/fi';
import { useOrderHistory } from '../context/OrderHistoryContext';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { Order, OrderStatus } from '../types/order';
import { formatCurrency } from '../utilities/formatCurrency';
import { OrderReceiptModal } from '../components/OrderReceiptModal';
import { toast } from 'react-toastify';

export function Orders() {
  const { orders } = useOrderHistory();
  const { increaseItemQuantity, openCart } = useShoppingCart();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // If URL has ?id=SC-XXXXXX, automatically open receipt modal
  useEffect(() => {
    const orderIdParam = searchParams.get('id');
    if (orderIdParam) {
      const match = orders.find((o) => o.id.toLowerCase() === orderIdParam.toLowerCase());
      if (match) {
        setSelectedOrder(match);
        setIsReceiptModalOpen(true);
      }
    }
  }, [searchParams, orders]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter((o) => o.status !== 'delivered').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    return {
      totalSpent,
      activeOrders,
      deliveredOrders
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === 'active' && order.status === 'delivered') return false;
      if (statusFilter === 'delivered' && order.status !== 'delivered') return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesTracking = order.trackingNumber.toLowerCase().includes(q);
      const matchesEmail = order.customer.email.toLowerCase().includes(q);
      const matchesItem = order.items.some((item) =>
        item.name.toLowerCase().includes(q)
      );

      return matchesId || matchesTracking || matchesEmail || matchesItem;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleOpenReceipt = (order: Order) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        increaseItemQuantity(item.id);
      }
    });
    toast.success(`Reordered ${order.items.length} item(s) from order ${order.id}!`, {
      icon: <FiRepeat size={18} color="#4f46e5" />,
      autoClose: 2500
    });
    openCart();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return (
          <Badge bg="warning" className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold text-dark">
            <FiClock size={13} />
            <span>Processing</span>
          </Badge>
        );
      case 'dispatched':
        return (
          <Badge bg="primary" className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold">
            <FiPackage size={13} />
            <span>Dispatched</span>
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge bg="info" className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold text-dark">
            <FiTruck size={13} />
            <span>In Transit</span>
          </Badge>
        );
      case 'delivered':
        return (
          <Badge bg="success" className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold">
            <FiCheckCircle size={13} />
            <span>Delivered</span>
          </Badge>
        );
    }
  };

  return (
    <div className="orders-page-container">
      {/* Header Section */}
      <section className="about-hero-section mb-4">
        <div className="hero-tag mx-auto">
          <FiPackage color="#4f46e5" />
          <span>Receipt Archive & Live Tracking</span>
        </div>
        <h1 className="hero-title mb-3">
          My <span className="hero-gradient-text">Orders & Invoices</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Review your purchase history, monitor live carrier shipping updates, download itemized invoices, or reorder your favorite gear in one click.
        </p>

        {/* Stats Row */}
        <div className="hero-stats-row justify-content-center">
          <div className="stat-item text-center">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">{metrics.activeOrders}</span>
            <span className="stat-label">Active Shipments</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">{metrics.deliveredOrders}</span>
            <span className="stat-label">Delivered Orders</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">{formatCurrency(metrics.totalSpent)}</span>
            <span className="stat-label">Lifetime Spend</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="orders-toolbar p-3 bg-white rounded-4 border shadow-sm mb-4">
        <Row className="g-3 align-items-center justify-content-between">
          <Col md={5} lg={4}>
            <div className="position-relative">
              <FiSearch
                className="position-absolute text-muted"
                style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                size={16}
              />
              <Form.Control
                type="text"
                placeholder="Search by order ID, product, or tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-pill ps-5 py-2"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          </Col>

          <Col md={7} lg={6} className="d-flex justify-content-md-end gap-2 flex-wrap">
            <button
              type="button"
              className={`review-filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`review-filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              <FiTruck size={13} className="me-1" />
              Active Shipments ({metrics.activeOrders})
            </button>
            <button
              type="button"
              className={`review-filter-pill ${statusFilter === 'delivered' ? 'active' : ''}`}
              onClick={() => setStatusFilter('delivered')}
            >
              <FiCheckCircle size={13} className="me-1" />
              Delivered ({metrics.deliveredOrders})
            </button>
          </Col>
        </Row>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}
          >
            <FiPackage />
          </div>
          <h4 className="fw-bold text-dark mb-2">No orders found</h4>
          <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
            {orders.length === 0
              ? "You haven't placed any orders yet. Discover our premium gear and check out to view your first receipt!"
              : 'No orders matched your current search and filter criteria. Try adjusting your query.'}
          </p>
          <Link to="/store" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
            Explore Store Catalog
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 mb-5">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="order-card p-3 p-md-4 rounded-4 border bg-white shadow-sm transition-all"
              >
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 border-bottom mb-3">
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="font-monospace fw-bold text-primary fs-5">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FiCalendar size={13} />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  <div className="text-md-end">
                    <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      Carrier & Tracking
                    </span>
                    <span className="font-monospace text-dark fw-bold small">
                      {order.carrier} • {order.trackingNumber}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                  {/* Item Thumbnails & Summary */}
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="position-relative"
                          title={`${item.name} (x${item.quantity})`}
                        >
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            className="rounded-3 border p-1 bg-white"
                            style={{
                              width: '56px',
                              height: '56px',
                              objectFit: 'contain'
                            }}
                          />
                          {item.quantity > 1 && (
                            <span
                              className="position-absolute badge rounded-pill bg-dark"
                              style={{
                                top: '-6px',
                                right: '-6px',
                                fontSize: '0.65rem'
                              }}
                            >
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div
                          className="rounded-3 border d-flex align-items-center justify-content-center bg-light text-muted small fw-bold"
                          style={{ width: '56px', height: '56px' }}
                        >
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                        {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-muted small">
                        Destination: {order.customer.city}, {order.customer.state}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="d-flex align-items-center justify-content-between justify-content-lg-end gap-3 w-100 w-lg-auto pt-2 pt-lg-0 border-top border-lg-0">
                    <div className="text-start text-lg-end">
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Total Paid
                      </div>
                      <div className="fs-5 fw-bold text-primary">
                        {formatCurrency(order.total)}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1"
                        onClick={() => handleReorder(order)}
                        title="Reorder all items in this order"
                      >
                        <FiRepeat size={14} />
                        <span className="d-none d-sm-inline">Reorder</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 shadow-sm"
                        onClick={() => handleOpenReceipt(order)}
                      >
                        <FiFileText size={14} />
                        <span>View Receipt</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Receipt & Tracking Modal */}
      <OrderReceiptModal
        order={selectedOrder}
        show={isReceiptModalOpen}
        onHide={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
