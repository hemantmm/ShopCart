import { useState, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Button, Nav } from 'react-bootstrap';
import {
  RiStarSFill,
  RiShoppingCart2Line,
  RiHeartLine,
  RiHeartFill,
  RiCheckboxCircleFill,
  RiTruckLine,
  RiShieldCheckLine,
  RiRestartLine,
  RiShareForwardLine,
  RiCloseLine,
  RiAddLine,
  RiSubtractLine,
} from 'react-icons/ri';
import { FiCheck } from 'react-icons/fi';
import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/ProductQuickViewContext';
import storeItems from '../data/items.json';
import { Product } from '../types/product';
import { toast } from 'react-toastify';

export function ProductQuickViewModal() {
  const { selectedProduct, isOpen, closeQuickView, openQuickView } = useQuickView();
  const { getItemQuantity, increaseItemQuantity, openCart } = useShoppingCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping'>('overview');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.imgUrl);
      setActiveTab('overview');
      setSelectedQty(1);
      setCopiedLink(false);
    }
  }, [selectedProduct]);

  const currentCartQty = selectedProduct ? getItemQuantity(selectedProduct.id) : 0;
  const isWishlisted = selectedProduct ? isInWishlist(selectedProduct.id) : false;

  const discountPercent = useMemo(() => {
    if (!selectedProduct?.originalPrice || selectedProduct.originalPrice <= selectedProduct.price) {
      return 0;
    }
    return Math.round(
      ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100
    );
  }, [selectedProduct]);

  const relatedItems = useMemo(() => {
    if (!selectedProduct) return [];
    return (storeItems as unknown as Product[])
      .filter((item) => item.category.toLowerCase() === selectedProduct.category.toLowerCase() && item.id !== selectedProduct.id)
      .slice(0, 3);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const galleryImages = selectedProduct.gallery && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [selectedProduct.imgUrl];

  const handleAddToCart = () => {
    for (let i = 0; i < selectedQty; i++) {
      increaseItemQuantity(selectedProduct.id);
    }
    toast.success(
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
            {selectedProduct.name}
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            {selectedQty} {selectedQty > 1 ? 'items' : 'item'} added to cart!
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary px-3 py-1 text-nowrap fw-semibold shadow-sm"
          style={{ fontSize: '0.75rem', borderRadius: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            closeQuickView();
            openCart();
          }}
        >
          View Cart
        </button>
      </div>,
      {
        icon: <RiShoppingCart2Line size={20} color="#4f46e5" />,
        autoClose: 2500,
        closeOnClick: true,
      }
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(selectedProduct.id);
    if (!isWishlisted) {
      toast.success(
        <div>
          <span className="fw-bold text-capitalize">{selectedProduct.name}</span> added to wishlist!
        </div>,
        {
          icon: <RiHeartFill size={20} color="#f43f5e" />,
          autoClose: 2000,
        }
      );
    } else {
      toast.info(
        <div>
          <span className="fw-bold text-capitalize">{selectedProduct.name}</span> removed from wishlist
        </div>,
        { autoClose: 2000 }
      );
    }
  };

  const handleShareProduct = async () => {
    try {
      const shareUrl = `${window.location.origin}/store?category=${encodeURIComponent(
        selectedProduct.category
      )}&search=${encodeURIComponent(selectedProduct.name)}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        toast.success('Product link copied to clipboard!', { autoClose: 2000 });
        setTimeout(() => setCopiedLink(false), 3000);
      }
    } catch {
      toast.info('Share feature copied product name.', { autoClose: 2000 });
    }
  };

  const maxStock = selectedProduct.stock ?? 10;

  return (
    <Modal
      show={isOpen}
      onHide={closeQuickView}
      size="xl"
      centered
      className="product-quickview-modal"
      backdropClassName="product-quickview-backdrop"
      aria-labelledby="quickview-title"
    >
      <Modal.Body className="p-0 position-relative overflow-hidden rounded-4">
        <button
          type="button"
          className="quickview-close-btn"
          onClick={closeQuickView}
          aria-label="Close product view"
        >
          <RiCloseLine size={24} />
        </button>

        <Row className="g-0">
          <Col lg={6} className="quickview-gallery-col p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <span className="badge bg-light text-primary border rounded-pill px-3 py-1 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  {selectedProduct.category}
                </span>

                <div className="d-flex align-items-center gap-2">
                  {discountPercent > 0 && (
                    <span className="badge bg-danger rounded-pill px-2 py-1 fw-bold">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {selectedProduct.badge && (
                    <span className="badge bg-warning text-dark rounded-pill px-2 py-1 fw-bold">
                      ★ {selectedProduct.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="quickview-main-image-wrapper mb-3 position-relative rounded-4 overflow-hidden shadow-sm">
                <img
                  src={activeImage || selectedProduct.imgUrl}
                  alt={selectedProduct.name}
                  className="quickview-main-image img-fluid"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 flex-wrap">
                  {galleryImages.map((img, idx) => {
                    const isSelected = (activeImage || selectedProduct.imgUrl) === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`quickview-thumb-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setActiveImage(img)}
                        aria-label={`View image angle ${idx + 1}`}
                      >
                        <img src={img} alt={`${selectedProduct.name} angle ${idx + 1}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top gap-2">
              <Button
                variant={isWishlisted ? 'danger' : 'outline-danger'}
                size="sm"
                className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
                onClick={handleToggleWishlist}
              >
                {isWishlisted ? <RiHeartFill size={18} /> : <RiHeartLine size={18} />}
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                onClick={handleShareProduct}
                title="Copy share link"
              >
                {copiedLink ? <FiCheck size={16} className="text-success" /> : <RiShareForwardLine size={18} />}
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </Button>
            </div>
          </Col>

          <Col lg={6} className="quickview-details-col p-4 p-md-5 d-flex flex-column">
            <div className="mb-2">
              {selectedProduct.brand && (
                <div className="quickview-brand-label text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                  {selectedProduct.brand}
                </div>
              )}
              <h2 id="quickview-title" className="fw-bolder text-capitalize mb-2 text-dark" style={{ fontSize: '1.85rem' }}>
                {selectedProduct.name}
              </h2>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center gap-1 text-warning">
                {[...Array(5)].map((_, i) => (
                  <RiStarSFill
                    key={i}
                    size={20}
                    style={{
                      color: i < selectedProduct.rating ? '#f59e0b' : 'var(--star-empty, #e2e8f0)',
                    }}
                  />
                ))}
              </div>
              <span className="fw-bold text-dark small">{selectedProduct.rating}.0</span>
              <span className="text-muted small">• 142 verified ratings</span>
            </div>

            <div className="d-flex align-items-baseline gap-3 mb-3 p-3 bg-light rounded-3 border">
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bolder text-primary">
                  {formatCurrency(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-muted text-decoration-line-through fs-6">
                    {formatCurrency(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>

              {discountPercent > 0 && selectedProduct.originalPrice && (
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 fw-bold small">
                  Save {formatCurrency(selectedProduct.originalPrice - selectedProduct.price)} ({discountPercent}% OFF)
                </span>
              )}
            </div>

            <div className="mb-3 d-flex align-items-center gap-2">
              {maxStock <= 5 ? (
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
                  <span className="pulse-dot warning-dot"></span>
                  Only {maxStock} items left in stock — order soon!
                </span>
              ) : (
                <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
                  <span className="pulse-dot success-dot"></span>
                  In Stock — Ready for Express Dispatch
                </span>
              )}
            </div>

            <div className="mb-3">
              <Nav variant="pills" className="quickview-nav-pills gap-1 p-1 bg-light rounded-pill border">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    className="rounded-pill py-1 px-3 fw-semibold small"
                  >
                    Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'specs'}
                    onClick={() => setActiveTab('specs')}
                    className="rounded-pill py-1 px-3 fw-semibold small"
                  >
                    Tech Specs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'shipping'}
                    onClick={() => setActiveTab('shipping')}
                    className="rounded-pill py-1 px-3 fw-semibold small"
                  >
                    Delivery & Returns
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <div className="quickview-tab-content flex-grow-1 mb-4 overflow-auto pe-1" style={{ maxHeight: '200px' }}>
              {activeTab === 'overview' && (
                <div>
                  <p className="text-secondary small lh-base mb-3">
                    {selectedProduct.description ||
                      'Crafted with premium materials and thoughtful engineering for outstanding reliability and daily performance.'}
                  </p>
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="d-flex flex-column gap-2">
                      <div className="fw-bold small text-dark mb-1">Highlights:</div>
                      {selectedProduct.features.map((feat, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 small text-muted">
                          <RiCheckboxCircleFill className="text-primary mt-1 flex-shrink-0" size={15} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="quickview-specs-table">
                  {selectedProduct.specs ? (
                    <div className="d-flex flex-column gap-2">
                      {Object.entries(selectedProduct.specs)
                        .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0)
                        .map(([label, value]) => (
                          <div
                            key={label}
                            className="d-flex justify-content-between align-items-center py-2 px-3 bg-light rounded-3 small"
                          >
                            <span className="fw-semibold text-muted">{label}</span>
                            <span className="fw-bold text-dark text-end">{value}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-muted small py-3 text-center">
                      No technical specifications available for this item.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="d-flex flex-column gap-3 small text-muted">
                  <div className="d-flex align-items-start gap-3">
                    <RiTruckLine className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="fw-bold text-dark">Free Express Shipping</div>
                      <div>Orders over $50 qualify for complimentary priority express 2-day delivery.</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <RiRestartLine className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="fw-bold text-dark">30-Day Hassle-Free Returns</div>
                      <div>Not satisfied? Return undamaged items within 30 days for a full refund or exchange.</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <RiShieldCheckLine className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="fw-bold text-dark">1-Year Authentic Warranty</div>
                      <div>Includes official manufacturer warranty covering any defects or component issues.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-3 border-top">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center border rounded-pill p-1 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-1 d-flex align-items-center"
                    onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                    disabled={selectedQty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <RiSubtractLine size={16} />
                  </button>
                  <span className="fw-bold px-3 text-dark small">{selectedQty}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-primary p-1 d-flex align-items-center"
                    onClick={() => setSelectedQty((prev) => Math.min(maxStock, prev + 1))}
                    disabled={selectedQty >= maxStock}
                    aria-label="Increase quantity"
                  >
                    <RiAddLine size={16} />
                  </button>
                </div>

                <Button
                  variant="primary"
                  className="rounded-pill py-2 px-4 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow"
                  onClick={handleAddToCart}
                >
                  <RiShoppingCart2Line size={20} />
                  <span>
                    {currentCartQty > 0
                      ? `Add More (${currentCartQty} in Cart)`
                      : `Add to Cart • ${formatCurrency(selectedProduct.price * selectedQty)}`}
                  </span>
                </Button>
              </div>

              {currentCartQty > 0 && (
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="btn btn-link text-primary p-0 small fw-semibold text-decoration-none"
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => {
                      closeQuickView();
                      openCart();
                    }}
                  >
                    Item is already in your cart. View Cart & Checkout →
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {relatedItems.length > 0 && (
          <div className="quickview-related-section p-4 bg-light border-top">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0 text-dark">
                More in <span className="text-primary text-capitalize">{selectedProduct.category}</span>
              </h6>
              <span className="text-muted small">Click to quick-switch view</span>
            </div>

            <Row className="g-3">
              {relatedItems.map((item) => (
                <Col key={item.id} xs={12} sm={4}>
                  <div
                    className="quickview-related-card p-2 bg-white rounded-3 border d-flex align-items-center gap-3"
                    onClick={() => openQuickView(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openQuickView(item);
                      }
                    }}
                  >
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className="rounded-2"
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <div className="min-w-0 flex-grow-1">
                      <div className="fw-bold text-dark text-truncate text-capitalize small">
                        {item.name}
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <span className="fw-bold text-primary small">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-warning small d-flex align-items-center gap-1">
                          <RiStarSFill size={14} /> {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
