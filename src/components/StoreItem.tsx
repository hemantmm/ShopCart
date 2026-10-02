import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { RiStarSFill, RiShoppingCart2Line, RiAddLine, RiSubtractLine, RiDeleteBin6Line, RiHeartLine, RiHeartFill } from 'react-icons/ri';

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  rating: number;
  imgUrl: string;
  category?: string;
};

export function StoreItem({ id, name, price, imgUrl, rating, category }: StoreItemProps) {
  const { getItemQuantity, increaseItemQuantity, decreaseItemQuantity, removeFromCart, openCart } = useShoppingCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const quantity = getItemQuantity(id);
  const isWishlisted = isInWishlist(id);

  const getTagClass = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'shoes': return 'tag-shoes';
      case 'books': return 'tag-books';
      case 'laptop': return 'tag-laptop';
      case 'phone': return 'tag-phone';
      default: return 'tag-shoes';
    }
  };

  const handleAddToCart = () => {
    increaseItemQuantity(id);
    toast.success(
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{name}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Item added to cart!</div>
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
        closeOnClick: true,
      }
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);
    if (!isWishlisted) {
      toast.success(
        <div>
          <span className="fw-bold">{name}</span> added to wishlist!
        </div>,
        {
          icon: <RiHeartFill size={20} color="#f43f5e" />,
          autoClose: 2000,
        }
      );
    } else {
      toast.info(
        <div>
          <span className="fw-bold">{name}</span> removed from wishlist
        </div>,
        {
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className='modern-product-card position-relative'>
      <button 
        className="wishlist-btn border-0 bg-transparent p-2 position-absolute" 
        style={{ top: '10px', right: '10px', zIndex: 10, cursor: 'pointer', transition: 'all 0.2s ease' }}
        onClick={handleToggleWishlist}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <RiHeartFill size={24} color="#f43f5e" />
        ) : (
          <RiHeartLine size={24} color="#94a3b8" />
        )}
      </button>

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
              type="button"
              className='product-add-btn'
              onClick={handleAddToCart}
            >
              <RiShoppingCart2Line size={18} />
              Add to Cart
            </button>
          ) : (
            <div className='d-flex flex-column gap-2'>
              <div className="qty-control-box">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => decreaseItemQuantity(id)}
                  title="Decrease quantity"
                  aria-label={`Decrease quantity of ${name}`}
                >
                  <RiSubtractLine size={16} />
                </button>
                <div className="d-flex align-items-baseline gap-1">
                  <span className='fw-bold fs-6 text-dark'>{quantity}</span>
                  <span className='text-muted' style={{ fontSize: '0.75rem' }}>in cart</span>
                </div>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => increaseItemQuantity(id)}
                  title="Increase quantity"
                  aria-label={`Increase quantity of ${name}`}
                >
                  <RiAddLine size={16} />
                </button>
              </div>
              <button
                type="button"
                className='btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1 w-100 py-1'
                style={{ fontSize: '0.8rem', borderRadius: '8px' }}
                onClick={() => {
                  removeFromCart(id);
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