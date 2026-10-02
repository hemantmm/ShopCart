import { Row, Col } from 'react-bootstrap';
import { useWishlist } from '../context/WishlistContext';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export function Wishlist() {
  const { wishlistItems } = useWishlist();

  const filteredItems = storeItems.filter(item => wishlistItems.includes(item.id));

  return (
    <div className="wishlist-page-container">
      <section className="about-hero-section mb-4">
        <div className="hero-tag mx-auto">
          <FiHeart color="#f43f5e" />
          <span>Your Wishlist</span>
        </div>
        <h1 className="hero-title mb-3">
          Saved for <span className="hero-gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}>Later</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Keep track of the gear you love. Add them to your cart when you're ready.
        </p>
      </section>

      {filteredItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
          <div className="mb-3" style={{ fontSize: '3rem', color: '#cbd5e1' }}>
            <FiHeart />
          </div>
          <h4 className="fw-bold text-dark mb-2">Your wishlist is empty</h4>
          <p className="text-muted mb-4">
            You haven't saved any items yet. Explore the store and find something you love!
          </p>
          <Link to="/store" className="btn btn-primary rounded-pill px-4 fw-bold">
            Browse Store
          </Link>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-5">
          {filteredItems.map(item => (
            <Col key={item.id}>
              <StoreItem
                id={item.id}
                name={item.name}
                price={item.price}
                rating={item.rating}
                imgUrl={item.imgUrl}
                category={item.category}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
