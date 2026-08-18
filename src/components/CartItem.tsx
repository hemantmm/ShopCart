import { useShoppingCart } from '../context/ShoppingCartContext';
import storeItems from '../data/items.json';
import { formatCurrency } from '../utilities/formatCurrency';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

type CartItemProps = {
  id: number;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart, increaseItemQuantity, decreaseItemQuantity } = useShoppingCart();
  const item = storeItems.find((i) => i.id === id);
  if (!item) return null;

  return (
    <div className="cart-item-row">
      <img src={item.imgUrl} alt={item.name} className="cart-item-thumb" />

      <div className="flex-grow-1 min-w-0">
        <div className="d-flex align-items-center justify-content-between gap-1">
          <h6 className="fw-bold mb-0 text-truncate text-capitalize" style={{ fontSize: '0.92rem' }}>
            {item.name}
          </h6>
          <button
            className="btn btn-link text-danger p-0 border-0"
            onClick={() => removeFromCart(item.id)}
            title="Remove item"
          >
            <FiTrash2 size={15} />
          </button>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-2 py-1 border">
            <button
              className="btn btn-sm p-0 border-0 text-secondary d-flex align-items-center"
              onClick={() => decreaseItemQuantity(item.id)}
              title="Decrease quantity"
            >
              <FiMinus size={12} />
            </button>
            <span className="fw-bold small px-1 text-dark">{quantity}</span>
            <button
              className="btn btn-sm p-0 border-0 text-primary d-flex align-items-center"
              onClick={() => increaseItemQuantity(item.id)}
              title="Increase quantity"
            >
              <FiPlus size={12} />
            </button>
          </div>

          <div className="text-end">
            <span className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>
              {formatCurrency(item.price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                {formatCurrency(item.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}