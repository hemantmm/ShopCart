import { useState, useEffect } from 'react';
import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/ProductQuickViewContext';
import storeItems from '../data/items.json';
import { Product } from '../types/product';
import {
  getDefaultVariants,
  getProductPrice,
  isAnyVariantOutOfStock,
  formatVariantsSummary,
  getColorSwatch
} from '../utilities/variantHelpers';
import { toast } from 'react-toastify';
import {
  RiStarSFill,
  RiShoppingCart2Line,
  RiAddLine,
  RiSubtractLine,
  RiDeleteBin6Line,
  RiHeartLine,
  RiHeartFill,
  RiEyeLine
} from 'react-icons/ri';

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  rating: number;
  imgUrl: string;
  category?: string;
  brand?: string;
  originalPrice?: number;
  badge?: string;
};

export function StoreItem({
  id,
  name,
  price,
  imgUrl,
  rating,
  category,
  brand,
  originalPrice,
  badge
}: StoreItemProps) {
  const {
    getItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
    openCart
  } = useShoppingCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

  // Find full product metadata including variants
  const itemMeta = (storeItems as unknown as Product[]).find((i) => i.id === id);
  const effectiveBrand = brand ?? itemMeta?.brand;
  const effectiveOriginalPrice = originalPrice ?? itemMeta?.originalPrice;
  const effectiveBadge = badge ?? itemMeta?.badge;

  // Selected variants state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    getDefaultVariants(itemMeta || { variants: [] })
  );

  useEffect(() => {
    if (itemMeta) {
      setSelectedVariants((prev) => {
        if (Object.keys(prev).length === 0) {
          return getDefaultVariants(itemMeta);
        }
        return prev;
      });
    }
  }, [itemMeta]);

  // Dynamic price based on variant delta
  const activePrice = itemMeta ? getProductPrice(itemMeta, selectedVariants) : price;
  const priceDelta = activePrice - price;
  const activeOriginalPrice = effectiveOriginalPrice ? effectiveOriginalPrice + priceDelta : undefined;

  // Stock check for selected variants
  const isSelectedVariantOutOfStock = isAnyVariantOutOfStock(itemMeta?.variants, selectedVariants);
  const quantity = getItemQuantity(id, selectedVariants);
  const isWishlisted = isInWishlist(id);

  const getTagClass = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'shoes':
        return 'tag-shoes';
      case 'books':
        return 'tag-books';
      case 'laptop':
        return 'tag-laptop';
      case 'phone':
        return 'tag-phone';
      default:
        return 'tag-shoes';
    }
  };

  const handleAddToCart = () => {
    if (isSelectedVariantOutOfStock) {
      toast.warning('Selected option is currently out of stock.');
      return;
    }

    increaseItemQuantity(id, selectedVariants);
    const variantDesc = formatVariantsSummary(selectedVariants);

    toast.success(
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="fw-bold text-dark text-capitalize" style={{ fontSize: '0.9rem' }}>
            {name}
          </div>
          {variantDesc && (
            <div className="text-primary small fw-semibold" style={{ fontSize: '0.76rem' }}>
              {variantDesc}
            </div>
          )}
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>
            Item added to cart!
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary px-3 py-1 text-nowrap fw-semibold shadow-sm"
          style={{ fontSize: '0.75rem', borderRadius: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            openCart();
          }}
        >
          View Cart
        </button>
      </div>,
      {
        icon: <RiShoppingCart2Line size={20} color="#4f46e5" />,
        autoClose: 2500,
        closeOnClick: true
      }
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);
    if (!isWishlisted) {
      toast.success(
        <div>
          <span className="fw-bold text-capitalize">{name}</span> added to wishlist!
        </div>,
        {
          icon: <RiHeartFill size={20} color="#f43f5e" />,
          autoClose: 2000
        }
      );
    } else {
      toast.info(
        <div>
          <span className="fw-bold text-capitalize">{name}</span> removed from wishlist
        </div>,
        {
          autoClose: 2000
        }
      );
    }
  };

  return (
    <div className="modern-product-card position-relative d-flex flex-column h-100">
      <button
        className="wishlist-btn border-0 bg-transparent p-2 position-absolute"
        style={{
          top: '10px',
          right: '10px',
          zIndex: 10,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={handleToggleWishlist}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? (
          <RiHeartFill size={24} color="#f43f5e" />
        ) : (
          <RiHeartLine size={24} color="#94a3b8" />
        )}
      </button>

      <div
        className="card-img-wrapper position-relative"
        onClick={() => openQuickView(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openQuickView(id);
          }
        }}
        title="Click to view details"
      >
        {category && (
          <span className={`product-tag ${getTagClass(category)}`}>
            {category}
          </span>
        )}

        {effectiveBadge && (
          <span className="product-badge-pill">{effectiveBadge}</span>
        )}

        <img src={imgUrl} alt={name} loading="lazy" />

        <button
          type="button"
          className="product-card-quickview-btn"
          onClick={(e) => {
            e.stopPropagation();
            openQuickView(id);
          }}
          aria-label={`Quick view ${name}`}
        >
          <RiEyeLine size={16} />
          <span>Quick View</span>
        </button>
      </div>

      <div className="product-card-body d-flex flex-column flex-grow-1">
        {effectiveBrand && (
          <div
            className="product-brand-subtitle text-muted small fw-semibold text-uppercase mb-1"
            style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
          >
            {effectiveBrand}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-start mb-1">
          <h4
            className="product-title text-capitalize"
            onClick={() => openQuickView(id)}
            role="button"
            title="Click to view details"
            style={{ cursor: 'pointer' }}
          >
            {name}
          </h4>
          <div className="text-end">
            <span className="product-price">{formatCurrency(activePrice)}</span>
            {activeOriginalPrice && activeOriginalPrice > activePrice && (
              <div
                className="text-muted small text-decoration-line-through"
                style={{ fontSize: '0.78rem' }}
              >
                {formatCurrency(activeOriginalPrice)}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-1 mb-2">
          {[...Array(5)].map((_, index) => (
            <RiStarSFill
              key={index}
              size={17}
              style={{
                color: index < rating ? '#f59e0b' : 'var(--star-empty, #e2e8f0)'
              }}
            />
          ))}
          <span className="text-muted ms-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            ({rating}.0)
          </span>
        </div>

        {/* Product Variant Selectors (Size, Color, Storage) */}
        {itemMeta?.variants && itemMeta.variants.length > 0 && (
          <div className="product-card-variants mb-3 p-2 rounded-3 bg-light border border-opacity-50">
            {itemMeta.variants.map((v) => {
              if (v.type === 'color') {
                return (
                  <div key={v.type} className="variant-row mb-1">
                    <div className="d-flex align-items-center justify-content-between small mb-1">
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Color:</span>
                      <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.72rem', maxWidth: '120px' }}>
                        {selectedVariants['color']}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1 flex-wrap">
                      {v.options.map((opt) => {
                        const swatch = getColorSwatch(opt.value);
                        const isSelected = selectedVariants['color'] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={`store-color-swatch ${isSelected ? 'active' : ''}`}
                            style={{
                              background: swatch.bg,
                              border: swatch.border || (isSelected ? '2px solid #4f46e5' : '1px solid rgba(0,0,0,0.15)')
                            }}
                            title={opt.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariants((prev) => ({ ...prev, color: opt.value }));
                            }}
                            aria-label={`Select color ${opt.label}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Size or Storage
              const labelText = v.type === 'size' ? 'Size' : 'Spec';
              return (
                <div key={v.type} className="variant-row">
                  <div className="d-flex align-items-center justify-content-between small mb-1">
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{labelText}:</span>
                    <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.72rem', maxWidth: '120px' }}>
                      {selectedVariants[v.type]}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-wrap">
                    {v.options.map((opt) => {
                      const isSelected = selectedVariants[v.type] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          className={`store-variant-pill ${isSelected ? 'active' : ''} ${!opt.inStock ? 'out-of-stock' : ''}`}
                          disabled={!opt.inStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVariants((prev) => ({ ...prev, [v.type]: opt.value }));
                          }}
                          title={!opt.inStock ? `${opt.label} (Out of Stock)` : opt.label}
                        >
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add to Cart / Qty Controls */}
        <div className="mt-auto">
          {isSelectedVariantOutOfStock ? (
            <button type="button" className="btn btn-secondary w-100 py-2 rounded-pill fw-semibold disabled" disabled>
              Out of Stock
            </button>
          ) : quantity === 0 ? (
            <button type="button" className="product-add-btn" onClick={handleAddToCart}>
              <RiShoppingCart2Line size={18} />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="d-flex flex-column gap-2">
              <div className="qty-control-box">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => decreaseItemQuantity(id, selectedVariants)}
                  title="Decrease quantity"
                  aria-label={`Decrease quantity of ${name}`}
                >
                  <RiSubtractLine size={16} />
                </button>
                <div className="d-flex align-items-baseline gap-1">
                  <span className="fw-bold fs-6 text-dark">{quantity}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>in cart</span>
                </div>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => increaseItemQuantity(id, selectedVariants)}
                  title="Increase quantity"
                  aria-label={`Increase quantity of ${name}`}
                >
                  <RiAddLine size={16} />
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1 w-100 py-1"
                style={{ fontSize: '0.8rem', borderRadius: '8px' }}
                onClick={() => {
                  removeFromCart(id, selectedVariants);
                  toast.info(`${name} removed from cart`, { autoClose: 2000 });
                }}
                aria-label={`Remove ${name} from cart`}
              >
                <RiDeleteBin6Line size={14} />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
