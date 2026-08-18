import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { RiStarSFill, RiShoppingCart2Line, RiAddLine, RiSubtractLine, RiDeleteBin6Line } from 'react-icons/ri';

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  rating: number;
  imgUrl: string;
  category?: string;
};

export function StoreItem({ id, name, price, imgUrl, rating, category }: StoreItemProps) {
  const { getItemQuantity, increaseItemQuantity, decreaseItemQuantity, removeFromCart } = useShoppingCart();
  const quantity = getItemQuantity(id);

  const getTagClass = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'shoes': return 'tag-shoes';
      case 'books': return 'tag-books';
      case 'laptop': return 'tag-laptop';
      case 'phone': return 'tag-phone';
      default: return 'tag-shoes';
    }
  };

  return (
    <div className='modern-product-card'>
      <div className="card-img-wrapper">
        {category && (
          <span className={`product-tag ${getTagClass(category)}`}>
            {category}
          </span>
        )}
        <img src={imgUrl} alt={name} loading="lazy" />
      </div>

      <div className="product-card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="product-title">{name}</h4>
          <span className="product-price">{formatCurrency(price)}</span>
        </div>

        <div className='d-flex align-items-center gap-1 mb-3'>
          {[...Array(5)].map((_, index) => (
            <RiStarSFill
              key={index}
              size={18}
              style={{
                color: index < rating ? '#f59e0b' : '#e2e8f0'
              }}
            />
          ))}
          <span className="text-muted ms-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            ({rating}.0)
          </span>
        </div>

        <div className="mt-auto">
          {quantity === 0 ? (
            <button
              className='product-add-btn'
              onClick={() => increaseItemQuantity(id)}
            >
              <RiShoppingCart2Line size={18} />
              Add to Cart
            </button>
          ) : (
            <div className='d-flex flex-column gap-2'>
              <div className="qty-control-box">
                <button
                  className="qty-btn"
                  onClick={() => decreaseItemQuantity(id)}
                  title="Decrease quantity"
                >
                  <RiSubtractLine size={16} />
                </button>
                <div className="d-flex align-items-baseline gap-1">
                  <span className='fw-bold fs-6 text-dark'>{quantity}</span>
                  <span className='text-muted' style={{ fontSize: '0.75rem' }}>in cart</span>
                </div>
                <button
                  className="qty-btn"
                  onClick={() => increaseItemQuantity(id)}
                  title="Increase quantity"
                >
                  <RiAddLine size={16} />
                </button>
              </div>
              <button
                className='btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1 w-100 py-1'
                style={{ fontSize: '0.8rem', borderRadius: '8px' }}
                onClick={() => removeFromCart(id)}
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