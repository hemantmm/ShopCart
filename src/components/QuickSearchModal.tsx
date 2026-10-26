import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiEye,
  FiShoppingCart,
  FiStar,
  FiTrendingUp,
  FiCornerDownLeft
} from 'react-icons/fi';
import { RiShoppingBag3Fill, RiSparklingFill } from 'react-icons/ri';
import storeItems from '../data/items.json';
import { Product } from '../types/product';
import { formatCurrency } from '../utilities/formatCurrency';
import { useQuickView } from '../context/ProductQuickViewContext';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { toast } from 'react-toastify';

type QuickSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'shoes', label: '👟 Shoes' },
  { id: 'phone', label: '📱 Phones' },
  { id: 'laptop', label: '💻 Laptops' },
  { id: 'books', label: '📚 Books' }
];

const POPULAR_SEARCHES = [
  'Nike Jordan',
  'iPhone 15',
  'MacBook Air',
  'Adidas Ultraboost',
  'IKIGAI'
];

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { openQuickView } = useQuickView();
  const { increaseItemQuantity, openCart } = useShoppingCart();

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedCategory('all');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const allProducts = storeItems as unknown as Product[];

    return allProducts.filter((item) => {
      if (
        selectedCategory !== 'all' &&
        item.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (!query) return true;

      const nameMatch = item.name.toLowerCase().includes(query);
      const brandMatch = Boolean(item.brand && item.brand.toLowerCase().includes(query));
      const categoryMatch = item.category.toLowerCase().includes(query);
      const descMatch = Boolean(item.description && item.description.toLowerCase().includes(query));
      const featuresMatch = Boolean(
        item.features && item.features.some((f) => f.toLowerCase().includes(query))
      );

      return nameMatch || brandMatch || categoryMatch || descMatch || featuresMatch;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-search-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelectProduct = (product: Product) => {
    onClose();
    openQuickView(product.id);
  };

  const handleNavigateToStore = (searchTerm?: string) => {
    onClose();
    const query = searchTerm ?? searchQuery;
    if (query.trim()) {
      navigate(`/store?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/store');
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    increaseItemQuantity(product.id);
    toast.success(
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="fw-bold text-dark text-capitalize" style={{ fontSize: '0.9rem' }}>
            {product.name}
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Item added to cart!</div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary px-3 py-1 text-nowrap fw-semibold shadow-sm"
          style={{ fontSize: '0.75rem', borderRadius: '20px' }}
          onClick={(btnEvt) => {
            btnEvt.stopPropagation();
            onClose();
            openCart();
          }}
        >
          View Cart
        </button>
      </div>,
      {
        icon: <RiShoppingBag3Fill size={20} color="#4f46e5" />,
        autoClose: 2500,
        closeOnClick: true
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredProducts.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredProducts.length > 0 && filteredProducts[selectedIndex]) {
        handleSelectProduct(filteredProducts[selectedIndex]);
      } else if (searchQuery.trim()) {
        handleNavigateToStore();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isQueryActive = searchQuery.trim().length > 0;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      className="spotlight-search-modal"
      contentClassName="spotlight-modal-content border-0 shadow-lg overflow-hidden"
      animation
    >
      <div className="spotlight-modal-inner" onKeyDown={handleKeyDown}>
        <div className="spotlight-search-bar d-flex align-items-center px-4 py-3 border-bottom position-relative">
          <FiSearch size={20} className="text-primary me-3 flex-shrink-0" />
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder="Search sneakers, laptops, phones, books, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="spotlight-input border-0 shadow-none px-0 fs-6 bg-transparent"
            aria-label="Search catalog products"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn btn-link text-muted p-1 border-0 me-2"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              title="Clear query"
              aria-label="Clear query"
            >
              <FiX size={18} />
            </button>
          )}
          <span className="spotlight-esc-pill text-muted small fw-semibold">
            ESC
          </span>
        </div>

        <div className="spotlight-categories-bar px-4 py-2 d-flex align-items-center gap-2 border-bottom flex-wrap">
          <span className="text-muted small fw-semibold me-1">Category:</span>
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                className={`spotlight-cat-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="spotlight-body-container" ref={resultsContainerRef}>
          {!isQueryActive && selectedCategory === 'all' && (
            <div className="spotlight-popular-section p-4">
              <div className="d-flex align-items-center gap-2 text-muted small fw-bold text-uppercase mb-3">
                <FiTrendingUp className="text-primary" />
                <span>Trending Searches</span>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="spotlight-trending-chip"
                    onClick={() => {
                      setSearchQuery(term);
                      inputRef.current?.focus();
                    }}
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2 text-muted small fw-bold text-uppercase mb-2">
                <RiSparklingFill className="text-warning" />
                <span>Featured Catalog Highlights</span>
              </div>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="spotlight-results-list px-2 py-2">
              {filteredProducts.map((product, idx) => {
                const isSelected = idx === selectedIndex;
                const discount =
                  product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;

                return (
                  <div
                    key={product.id}
                    data-search-index={idx}
                    className={`spotlight-result-row d-flex align-items-center justify-content-between p-3 rounded-3 ${
                      isSelected ? 'active' : ''
                    }`}
                    onClick={() => handleSelectProduct(product)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="d-flex align-items-center gap-3 min-w-0">
                      <div className="spotlight-result-thumb-wrapper flex-shrink-0 position-relative">
                        <img
                          src={product.imgUrl}
                          alt={product.name}
                          className="spotlight-result-thumb"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="mb-0 fw-bold text-dark text-truncate text-capitalize" style={{ fontSize: '0.95rem' }}>
                            {product.name}
                          </h6>
                          {product.brand && (
                            <span className="badge bg-light text-secondary border small px-2 py-0">
                              {product.brand}
                            </span>
                          )}
                          <span className="badge bg-primary bg-opacity-10 text-primary small text-capitalize px-2 py-0">
                            {product.category}
                          </span>
                          {product.stock !== undefined && product.stock <= 5 && (
                            <span className="badge bg-danger bg-opacity-10 text-danger small px-2 py-0">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <span className="d-flex align-items-center gap-1 text-warning fw-semibold">
                            <FiStar size={12} fill="#f59e0b" color="#f59e0b" />
                            {product.rating}.0
                          </span>
                          <span>•</span>
                          <span className="spotlight-result-desc text-truncate d-none d-sm-inline" style={{ maxWidth: '240px' }}>
                            {product.description || 'Verified authentic premium essential.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 flex-shrink-0 ms-3">
                      <div className="text-end">
                        <div className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                          {formatCurrency(product.price)}
                        </div>
                        {discount > 0 && product.originalPrice && (
                          <div className="text-muted small text-decoration-line-through" style={{ fontSize: '0.74rem' }}>
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div className="spotlight-row-actions d-none d-sm-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary spotlight-action-btn"
                          title="Quick View specs & gallery"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product);
                          }}
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary spotlight-action-btn"
                          title="Add item to shopping cart"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <FiShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="spotlight-empty-state text-center py-5 px-4">
              <div className="mb-3 text-muted" style={{ fontSize: '2.5rem' }}>
                <FiSearch />
              </div>
              <h5 className="fw-bold text-dark mb-1">No products found</h5>
              <p className="text-muted small mb-4">
                We couldn't find any items matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-semibold"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  inputRef.current?.focus();
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        <div className="spotlight-modal-footer px-4 py-3 bg-light border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="spotlight-footer-hints d-flex align-items-center gap-3 text-muted small">
            <span className="d-flex align-items-center gap-1">
              <kbd className="spotlight-kbd">↑</kbd> <kbd className="spotlight-kbd">↓</kbd> Navigate
            </span>
            <span className="d-flex align-items-center gap-1">
              <kbd className="spotlight-kbd"><FiCornerDownLeft size={10} /></kbd> Select
            </span>
            <span className="d-flex align-items-center gap-1">
              <kbd className="spotlight-kbd">ESC</kbd> Close
            </span>
          </div>

          <button
            type="button"
            className="btn btn-link text-primary p-0 small fw-bold text-decoration-none d-flex align-items-center gap-1"
            onClick={() => handleNavigateToStore()}
          >
            <span>View all products in Store</span>
            <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

