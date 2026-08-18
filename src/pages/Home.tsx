import { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { StoreItem } from '../components/StoreItem';
import SlideShow, { ShowcaseSlide } from '../components/SlideShow';
import storeItems from '../data/items.json';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { formatCurrency } from '../utilities/formatCurrency';
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiHeadphones,
  FiCheckCircle,
  FiMail,
  FiTrendingUp,
  FiStar
} from 'react-icons/fi';
import {
  RiShoppingBag3Fill,
  RiFlashlightFill,
  RiFireFill
} from 'react-icons/ri';

const showcaseSlides: ShowcaseSlide[] = [
  {
    id: 4,
    name: 'iPhone 15 Pro',
    category: 'Phone',
    price: 1100,
    rating: 4,
    tag: '⚡ Flagship Tech',
    imageUrl: '/imgs/iphone.png'
  },
  {
    id: 5,
    name: 'Nike Air Jordan 1',
    category: 'Shoes',
    price: 999.99,
    rating: 5,
    tag: '🔥 Streetwear Icon',
    imageUrl: '/imgs/nikejordan1.png'
  },
  {
    id: 9,
    name: 'MacBook Air M2',
    category: 'Laptop',
    price: 1100,
    rating: 5,
    tag: '💻 Creator Pick',
    imageUrl: '/imgs/macbook.png'
  },
  {
    id: 2,
    name: 'IKIGAI: The Art of Life',
    category: 'Books',
    price: 69,
    rating: 5,
    tag: '📚 #1 Bestseller',
    imageUrl: '/imgs/book2.png'
  },
  {
    id: 7,
    name: 'Adidas Ultraboost AIR',
    category: 'Shoes',
    price: 899.99,
    rating: 4,
    tag: '👟 Performance Run',
    imageUrl: '/imgs/adidas1.png'
  }
];

const categoryList = [
  { id: 'all', label: 'All Products', icon: '⚡' },
  { id: 'shoes', label: 'Footwear', icon: '👟' },
  { id: 'phone', label: 'Smartphones', icon: '📱' },
  { id: 'laptop', label: 'Laptops & PCs', icon: '💻' },
  { id: 'books', label: 'Inspiring Reads', icon: '📚' }
];

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Verified Buyer',
    avatar: 'SJ',
    comment: 'The Nike Air Jordans arrived within 48 hours! 100% authentic and packaged with immense care. ShopCart is my new favorite go-to.',
    rating: 5,
    item: 'Nike Air Jordan'
  },
  {
    name: 'David Patel',
    role: 'Tech Enthusiast',
    avatar: 'DP',
    comment: 'Got the MacBook Air for work and the price beat every other competitor. Fast checkout and seamless cart experience.',
    rating: 5,
    item: 'MacBook Air'
  },
  {
    name: 'Elena Rostova',
    role: 'Avid Reader',
    avatar: 'ER',
    comment: 'Ordered both Ikigai and The Alchemist. Arrived in pristine condition. Highly recommend their curated collections!',
    rating: 5,
    item: 'IKIGAI Book'
  }
];

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { increaseItemQuantity } = useShoppingCart();

  // Flash deal countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? storeItems
    : storeItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
    }
  };

  const flashDealItem = storeItems.find(i => i.id === 5) || storeItems[0]; // Nike Air Jordan

  return (
    <div className="home-page-container">
      {/* 1. HERO SHOWCASE SECTION */}
      <section className="hero-wrapper">
        <Row className="align-items-center g-4">
          <Col lg={7} className="text-lg-start text-center">
            <div className="hero-tag">
              <RiFlashlightFill color="#38bdf8" />
              <span>Summer Drop 2026 • Up to 40% Off</span>
            </div>
            <h1 className="hero-title">
              Elevate Your Everyday with <span className="hero-gradient-text">Next-Gen Picks</span>
            </h1>
            <p className="hero-subtitle">
              Discover verified authentic sneakers, cutting-edge laptops, flagship smartphones, and transformative books handpicked for modern tastemakers.
            </p>

            <div className="d-flex align-items-center justify-content-lg-start justify-content-center gap-3 flex-wrap">
              <Link to="/store" className="hero-cta-btn">
                <span>Explore Store</span>
                <FiArrowRight size={18} />
              </Link>
              <a href="#flash-deal" className="hero-secondary-btn">
                <RiFireFill color="#f87171" size={18} />
                <span>Today's Flash Deal</span>
              </a>
            </div>

            <div className="hero-stats-row justify-content-lg-start justify-content-center">
              <div className="stat-item">
                <span className="stat-number">15,000+</span>
                <span className="stat-label">Happy Shoppers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9 ★</span>
                <span className="stat-label">Verified Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">&lt; 24h</span>
                <span className="stat-label">Fast Dispatch</span>
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <SlideShow slides={showcaseSlides} interval={4000} />
          </Col>
        </Row>
      </section>

      {/* 2. TRUST & VALUE PROPOSITIONS BAR */}
      <section className="trust-bar-container">
        <div className="trust-card">
          <div className="trust-icon-box">
            <FiTruck />
          </div>
          <div>
            <h5 className="trust-title">Free Express Shipping</h5>
            <p className="trust-desc">Complimentary shipping on all orders over $50</p>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-icon-box">
            <FiShield />
          </div>
          <div>
            <h5 className="trust-title">100% Secure Checkout</h5>
            <p className="trust-desc">Protected by 256-bit encrypted gateway</p>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-icon-box">
            <FiRotateCcw />
          </div>
          <div>
            <h5 className="trust-title">30-Day Hassle-Free Return</h5>
            <p className="trust-desc">Simple no-questions-asked refund policy</p>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-icon-box">
            <FiHeadphones />
          </div>
          <div>
            <h5 className="trust-title">24/7 Dedicated Support</h5>
            <p className="trust-desc">Direct line to our personal shopping concierge</p>
          </div>
        </div>
      </section>

      {/* 3. FLASH DEAL OF THE DAY */}
      <section id="flash-deal" className="flash-deal-box">
        <Row className="align-items-center g-4">
          <Col lg={7} className="text-lg-start text-center">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-danger bg-opacity-25 rounded-pill text-danger fw-bold small mb-2 border border-danger border-opacity-50">
              <RiFireFill />
              <span>LIMITED QUANTITY • FLASH DROP</span>
            </div>
            <h2 className="flash-deal-title fw-bold text-white mb-2">Deal of the Day</h2>
            <p className="text-slate-300 flash-deal-subtitle" style={{ color: '#cbd5e1' }}>
              Grab the iconic <strong className="text-white">{flashDealItem.name}</strong> at a special promotional rate before the clock runs out.
            </p>

            <div className="countdown-wrapper justify-content-lg-start justify-content-center">
              <div className="countdown-card">
                <span className="countdown-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-card">
                <span className="countdown-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="countdown-card">
                <span className="countdown-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>

            <div className="flash-deal-action-box d-flex align-items-center justify-content-lg-start justify-content-center gap-3">
              <div className="flash-deal-price-box">
                <span className="text-decoration-line-through text-muted fs-6 me-2">
                  {formatCurrency(flashDealItem.price * 1.25)}
                </span>
                <span className="fs-3 fw-bold text-warning">
                  {formatCurrency(flashDealItem.price)}
                </span>
              </div>
              <Button
                variant="warning"
                className="flash-deal-btn fw-bold px-4 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow"
                onClick={() => increaseItemQuantity(flashDealItem.id)}
              >
                <RiShoppingBag3Fill size={18} />
                <span>Claim Deal</span>
              </Button>
            </div>
          </Col>

          <Col lg={5} className="text-center">
            <div className="flash-deal-img-card">
              <img
                src={flashDealItem.imgUrl}
                alt={flashDealItem.name}
                className="flash-deal-img"
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* 4. INTERACTIVE CATEGORY HUB & CURATED STORE */}
      <section className="category-hub-wrapper">
        <div className="section-header">
          <div>
            <div className="d-flex align-items-center gap-2 text-primary fw-bold small text-uppercase mb-1">
              <FiTrendingUp />
              <span>Trending Catalog</span>
            </div>
            <h2 className="section-title">Explore Top Collections</h2>
            <p className="section-subtitle">
              Instant filters for your favorite tech, footwear, and life-changing books.
            </p>
          </div>

          <div className="category-pills">
            {categoryList.map(cat => (
              <button
                key={cat.id}
                className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.map(item => (
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
      </section>

      {/* 5. SPOTLIGHT PROMO TILES */}
      <section className="mb-5 mt-4">
        <Row className="g-4">
          <Col md={4}>
            <div
              className="p-4 h-100 rounded-4 text-white d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                minHeight: '220px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <span className="badge bg-light text-dark mb-2">High Performance</span>
                <h3 className="fw-bold fs-4">Laptops & Workstations</h3>
                <p className="small text-slate-300" style={{ color: '#cbd5e1' }}>
                  Unleash power with M2 Silicon and Dell performance builds.
                </p>
              </div>
              <Link to="/store" className="text-white fw-bold d-inline-flex align-items-center gap-1 text-decoration-none small">
                Shop Computing <FiArrowRight />
              </Link>
            </div>
          </Col>

          <Col md={4}>
            <div
              className="p-4 h-100 rounded-4 text-white d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
                minHeight: '220px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <span className="badge bg-light text-dark mb-2">Iconic Style</span>
                <h3 className="fw-bold fs-4">Sneaker Culture</h3>
                <p className="small text-slate-300" style={{ color: '#fbcfe8' }}>
                  Jordan retros & Adidas originals engineered for trendsetters.
                </p>
              </div>
              <Link to="/store" className="text-white fw-bold d-inline-flex align-items-center gap-1 text-decoration-none small">
                Shop Footwear <FiArrowRight />
              </Link>
            </div>
          </Col>

          <Col md={4}>
            <div
              className="p-4 h-100 rounded-4 text-white d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                minHeight: '220px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <span className="badge bg-light text-dark mb-2">Wisdom & Growth</span>
                <h3 className="fw-bold fs-4">Bestselling Reads</h3>
                <p className="small text-slate-300" style={{ color: '#a7f3d0' }}>
                  Discover philosophy, purpose, and mastery with curated classics.
                </p>
              </div>
              <Link to="/store" className="text-white fw-bold d-inline-flex align-items-center gap-1 text-decoration-none small">
                Shop Books <FiArrowRight />
              </Link>
            </div>
          </Col>
        </Row>
      </section>

      {/* 6. TESTIMONIALS & SOCIAL PROOF */}
      <section className="testimonials-section">
        <div className="text-center mb-4">
          <span className="text-primary fw-bold text-uppercase small">Real Feedback</span>
          <h2 className="section-title">Loved by Shoppers Worldwide</h2>
          <p className="section-subtitle">
            See why over 15,000 customers trust ShopCart for their essential gear.
          </p>
        </div>

        <Row className="g-4">
          {testimonials.map((t, idx) => (
            <Col md={4} key={idx}>
              <div className="review-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="reviewer-avatar">{t.avatar}</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{t.name}</h6>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FiCheckCircle size={12} color="#10b981" />
                      {t.role}
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-1 text-warning mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p className="text-secondary small flex-grow-1 mb-3" style={{ lineHeight: '1.6' }}>
                  "{t.comment}"
                </p>

                <div className="border-top pt-2 mt-auto">
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Purchased: <strong className="text-dark">{t.item}</strong>
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* 7. VIP NEWSLETTER & DISCOUNT BANNER */}
      <section className="newsletter-banner">
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-pill small fw-bold mb-2">
            <FiMail />
            <span>VIP MEMBERSHIP PERK</span>
          </div>
          <h2 className="fs-1 fw-bold mb-2">Get 15% Off Your Next Order</h2>
          <p className="text-white-50 mx-auto" style={{ maxWidth: '500px' }}>
            Subscribe to our weekly drop alerts, secret discount codes, and early access to limited edition products.
          </p>

          {isSubscribed ? (
            <div className="bg-white text-dark d-inline-block px-4 py-2 rounded-pill fw-bold mt-3 shadow">
              🎉 Thank you! Use code <span className="text-primary">SHOPCART15</span> at checkout!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-input-group">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="newsletter-input"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
              <button type="submit" className="newsletter-submit-btn">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="shopcart-footer">
        <Row className="g-4 pb-4">
          <Col lg={4} md={6} xs={12} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <RiShoppingBag3Fill size={28} color="#818cf8" />
              <span className="fs-4 fw-bold text-white">ShopCart</span>
            </div>
            <p className="small text-slate-400 mx-auto mx-md-0" style={{ color: '#94a3b8', maxWidth: '320px' }}>
              Your destination for curated sneakers, powerhouse computing, flagship mobile phones, and timeless books.
            </p>
          </Col>

          <Col lg={2} md={3} sm={6} xs={6} className="text-start">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/store" className="footer-link">All Products</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </Col>

          <Col lg={3} md={3} sm={6} xs={6} className="text-start">
            <h6 className="text-white fw-bold mb-3">Categories</h6>
            <span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('shoes')}>Footwear</span>
            <span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('laptop')}>Laptops & PCs</span>
            <span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('phone')}>Smartphones</span>
            <span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('books')}>Books & Reads</span>
          </Col>

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h6 className="text-white fw-bold mb-3">Safe & Guaranteed</h6>
            <p className="small mx-auto mx-md-0" style={{ color: '#94a3b8', maxWidth: '320px' }}>
              All purchases are backed by our 100% money-back guarantee and 24/7 dedicated support team.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-2 mt-3 flex-wrap">
              <span className="badge bg-secondary">Visa</span>
              <span className="badge bg-secondary">MasterCard</span>
              <span className="badge bg-secondary">Apple Pay</span>
              <span className="badge bg-secondary">PayPal</span>
            </div>
          </Col>
        </Row>

        <div className="border-top border-secondary pt-3 text-center small text-slate-500" style={{ color: '#64748b' }}>
          © {new Date().getFullYear()} ShopCart Inc. Designed & Built with passion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}