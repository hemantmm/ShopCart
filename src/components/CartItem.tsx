import { useState } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import storeItems from '../data/items.json';
import { Product } from '../types/product';
import { formatCurrency } from '../utilities/formatCurrency';
import {
  getProductPrice,
  getColorSwatch
} from '../utilities/variantHelpers';
import { FiTrash2, FiPlus, FiMinus, FiEdit2, FiCheck } from 'react-icons/fi';

type CartItemProps = {
  id: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export function CartItem({ id, quantity, selectedVariants }: CartItemProps) {
  const {
    removeFromCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    updateItemVariants
  } = useShoppingCart();

  const [isEditingVariants, setIsEditingVariants] = useState(false);

  const item = (storeItems as unknown as Product[]).find((i) => i.id === id);
  if (!item) return null;

  const unitPrice = getProductPrice(item, selectedVariants);
  const hasVariants = item.variants && item.variants.length > 0;

  const handleVariantChange = (type: string, newValue: string) => {
    const updated = {
      ...(selectedVariants || {}),
      [type]: newValue
    };
    updateItemVariants(id, selectedVariants, updated);
  };

  return (
    <div className="cart-item-row">
      <img src={item.imgUrl} alt={item.name} className="cart-item-thumb" />

      <div className="flex-grow-1 min-w-0">
        <div className="d-flex align-items-center justify-content-between gap-1">
          <h6 className="fw-bold mb-0 text-truncate text-capitalize" style={{ fontSize: '0.92rem' }}>
            {item.name}
          </h6>
          <button
            type="button"
            className="btn btn-link text-danger p-0 border-0"
            onClick={() => removeFromCart(item.id, selectedVariants)}
            title="Remove item"
            aria-label={`Remove ${item.name} from cart`}
          >
            <FiTrash2 size={15} />
          </button>
        </div>

        {/* Selected Variants Display & Inline Picker */}
        {hasVariants && (
          <div className="cart-item-variants-wrapper mt-1">
            <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
              <div className="d-flex align-items-center gap-1 flex-wrap">
                {selectedVariants &&
                  Object.entries(selectedVariants).map(([type, val]) => {
                    const isColor = type === 'color';
                    const swatch = isColor ? getColorSwatch(val) : null;
                    return (
                      <span
                        key={type}
                        className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2"
                        style={{ fontSize: '0.72rem', fontWeight: 500 }}
                      >
                        {swatch && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: swatch.bg,
                              border: swatch.border || 'none'
                            }}
                          />
                        )}
                        <span className="text-muted text-capitalize">{type}:</span>
                        <strong className="text-dark">{val}</strong>
                      </span>
                    );
                  })}
              </div>

              <button
                type="button"
                className="btn btn-link p-0 text-primary small d-inline-flex align-items-center gap-1 text-decoration-none"
                style={{ fontSize: '0.75rem' }}
                onClick={() => setIsEditingVariants((prev) => !prev)}
                title="Change size or color"
              >
                {isEditingVariants ? (
                  <>
                    <FiCheck size={12} className="text-success" />
                    <span className="text-success fw-bold">Done</span>
                  </>
                ) : (
                  <>
                    <FiEdit2 size={11} />
                    <span>Change</span>
                  </>
                )}
              </button>
            </div>

            {/* Inline Variant Editor */}
            {isEditingVariants && (
              <div className="cart-inline-variant-editor p-2 mt-2 bg-light rounded-3 border">
                {item.variants?.map((v) => {
                  const currentVal = selectedVariants?.[v.type];
                  return (
                    <div key={v.type} className="mb-2 last-mb-0">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>
                          Select {v.type}:
                        </span>
                        <span className="small fw-semibold text-dark" style={{ fontSize: '0.7rem' }}>
                          {currentVal}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        {v.options.map((opt) => {
                          const isSelected = currentVal === opt.value;
                          if (v.type === 'color') {
                            const swatch = getColorSwatch(opt.value);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                className={`cart-variant-color-btn ${isSelected ? 'active' : ''}`}
                                style={{
                                  background: swatch.bg,
                                  border: swatch.border || (isSelected ? '2px solid #4f46e5' : '1px solid rgba(0,0,0,0.15)')
                                }}
                                onClick={() => handleVariantChange(v.type, opt.value)}
                                title={opt.label}
                                aria-label={`Select ${opt.label}`}
                              />
                            );
                          }

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              className={`cart-variant-pill-btn ${isSelected ? 'active' : ''} ${
                                !opt.inStock ? 'disabled-option' : ''
                              }`}
                              disabled={!opt.inStock}
                              onClick={() => handleVariantChange(v.type, opt.value)}
                              title={!opt.inStock ? `${opt.label} (Out of stock)` : opt.label}
                            >
                              <span>{opt.label}</span>
                              {opt.priceDelta ? (
                                <span className="small ms-1 opacity-75">
                                  {opt.priceDelta > 0 ? `+${opt.priceDelta}` : opt.priceDelta}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-2 py-1 border">
            <button
              type="button"
              className="btn btn-sm p-0 border-0 text-secondary d-flex align-items-center"
              onClick={() => decreaseItemQuantity(item.id, selectedVariants)}
              title="Decrease quantity"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <FiMinus size={12} />
            </button>
            <span className="fw-bold small px-1 text-dark">{quantity}</span>
            <button
              type="button"
              className="btn btn-sm p-0 border-0 text-primary d-flex align-items-center"
              onClick={() => increaseItemQuantity(item.id, selectedVariants)}
              title="Increase quantity"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <FiPlus size={12} />
            </button>
          </div>

          <div className="text-end">
            <span className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>
              {formatCurrency(unitPrice * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                {formatCurrency(unitPrice)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
