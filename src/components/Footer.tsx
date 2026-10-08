import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { FiShield, FiTruck, FiRotateCcw, FiHeart } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="shopcart-footer">
      <Container fluid="lg">
        <Row className="g-4 pb-4">
          <Col lg={4} md={6} xs={12} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <RiShoppingBag3Fill size={28} color="#818cf8" />
              <span className="fs-4 fw-bold text-white">ShopCart</span>
            </div>
            <p className="small text-slate-400 mx-auto mx-md-0" style={{ color: '#94a3b8', maxWidth: '320px', lineHeight: '1.6' }}>
              Your destination for curated sneakers, powerhouse computing, flagship mobile phones, and timeless books.
            </p>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mt-3 text-muted small flex-wrap">
              <span className="d-flex align-items-center gap-1">
                <FiShield color="#10b981" size={14} /> 100% Authentic
              </span>
              <span className="d-flex align-items-center gap-1">
                <FiTruck color="#38bdf8" size={14} /> Fast Dispatch
              </span>
              <span className="d-flex align-items-center gap-1">
                <FiRotateCcw color="#f59e0b" size={14} /> 30-Day Returns
              </span>
            </div>
          </Col>

          <Col lg={2} md={3} sm={6} xs={6} className="text-start">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/store" className="footer-link">Store</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/testimonials" className="footer-link">Reviews</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/wishlist" className="footer-link">Wishlist</Link>
          </Col>

          <Col lg={3} md={3} sm={6} xs={6} className="text-start">
            <h6 className="text-white fw-bold mb-3">Categories</h6>
            <Link to="/store" className="footer-link">Footwear & Sneakers</Link>
            <Link to="/store" className="footer-link">Laptops & PCs</Link>
            <Link to="/store" className="footer-link">Smartphones</Link>
            <Link to="/store" className="footer-link">Books & Literature</Link>
          </Col>

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h6 className="text-white fw-bold mb-3">Safe & Guaranteed</h6>
            <p className="small mx-auto mx-md-0" style={{ color: '#94a3b8', maxWidth: '320px', lineHeight: '1.6' }}>
              All purchases are backed by our 100% money-back guarantee and 24/7 dedicated support team.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-2 mt-3 flex-wrap">
              <span className="badge bg-secondary bg-opacity-50 border border-secondary border-opacity-25 px-2 py-1">Visa</span>
              <span className="badge bg-secondary bg-opacity-50 border border-secondary border-opacity-25 px-2 py-1">MasterCard</span>
              <span className="badge bg-secondary bg-opacity-50 border border-secondary border-opacity-25 px-2 py-1">Apple Pay</span>
              <span className="badge bg-secondary bg-opacity-50 border border-secondary border-opacity-25 px-2 py-1">PayPal</span>
            </div>
          </Col>
        </Row>

        <div className="border-top border-secondary border-opacity-25 pt-3 mt-2 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 small" style={{ color: '#64748b' }}>
          <span>© {new Date().getFullYear()} ShopCart Inc. All rights reserved.</span>
          <span className="d-flex align-items-center gap-1">
            Engineered with <FiHeart color="#f43f5e" size={13} /> by Hemant Mehta
          </span>
        </div>
      </Container>
    </footer>
  );
}

