import { useState } from 'react';
import { Container, Nav, Navbar as NavbarBs, Offcanvas } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import {
  RiShoppingBag3Fill,
  RiHeartLine,
  RiHeartFill,
  RiSunFill,
  RiMoonClearFill,
  RiMenu3Line
} from 'react-icons/ri';
import {
  FiShoppingBag,
  FiHome,
  FiGrid,
  FiInfo,
  FiStar,
  FiMail,
  FiChevronRight
} from 'react-icons/fi';

export function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();
  const { wishlistQuantity } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <NavbarBs sticky='top' className='shopcart-navbar shadow-sm mb-4 py-3'>
        <Container fluid="lg" className="d-flex align-items-center justify-content-between">
          <NavLink to='/' className='brand-badge d-flex align-items-center gap-2'>
            <RiShoppingBag3Fill size={26} style={{ color: '#4f46e5' }} />
            <span>ShopCart</span>
          </NavLink>

          <Nav className='mx-auto d-none d-md-flex align-items-center gap-1'>
            <Nav.Link to='/' as={NavLink} className='nav-link-custom'>
              Home
            </Nav.Link>
            <Nav.Link to='/store' as={NavLink} className='nav-link-custom'>
              Store
            </Nav.Link>
            <Nav.Link to='/about' as={NavLink} className='nav-link-custom'>
              About
            </Nav.Link>
            <Nav.Link to='/testimonials' as={NavLink} className='nav-link-custom'>
              Reviews
            </Nav.Link>
            <Nav.Link to='/contact' as={NavLink} className='nav-link-custom'>
              Contact
            </Nav.Link>
          </Nav>

          <div className="navbar-actions-group d-flex align-items-center gap-1 gap-sm-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="navbar-icon-btn theme-toggle"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <RiSunFill size={19} /> : <RiMoonClearFill size={19} />}
            </button>

            <div className="wishlist-btn-wrapper position-relative">
              <Link
                to="/wishlist"
                className="navbar-icon-btn wishlist"
                title="View Wishlist"
                aria-label={`View wishlist${wishlistQuantity > 0 ? `, ${wishlistQuantity} items` : ''}`}
              >
                {wishlistQuantity > 0 ? <RiHeartFill size={19} /> : <RiHeartLine size={19} />}
                {wishlistQuantity > 0 && (
                  <span className="cart-badge-count bg-danger">{wishlistQuantity}</span>
                )}
              </Link>
            </div>

            <div className="cart-btn-wrapper position-relative">
              <button
                type="button"
                onClick={openCart}
                className="navbar-icon-btn cart"
                title="View Cart"
                aria-label={`View cart${cartQuantity > 0 ? `, ${cartQuantity} items` : ''}`}
              >
                <FiShoppingBag size={19} />
                {cartQuantity > 0 && (
                  <span className="cart-badge-count">{cartQuantity}</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="navbar-icon-btn menu-toggle d-md-none"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <RiMenu3Line size={20} />
            </button>
          </div>
        </Container>
      </NavbarBs>

      <Offcanvas
        show={isMobileMenuOpen}
        onHide={closeMobileMenu}
        placement="start"
        className="mobile-nav-offcanvas"
      >
        <Offcanvas.Header closeButton className="border-bottom py-3">
          <NavLink
            to="/"
            className="brand-badge d-flex align-items-center gap-2"
            onClick={closeMobileMenu}
          >
            <RiShoppingBag3Fill size={26} style={{ color: '#4f46e5' }} />
            <span>ShopCart</span>
          </NavLink>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column p-3">
          <div className="d-flex flex-column gap-1 mb-4">
            <NavLink
              to="/"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <FiHome size={18} className="text-primary" />
                <span>Home</span>
              </span>
              <FiChevronRight size={16} className="text-muted" />
            </NavLink>

            <NavLink
              to="/store"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <FiGrid size={18} className="text-primary" />
                <span>Store</span>
              </span>
              <FiChevronRight size={16} className="text-muted" />
            </NavLink>

            <NavLink
              to="/about"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <FiInfo size={18} className="text-primary" />
                <span>About Us</span>
              </span>
              <FiChevronRight size={16} className="text-muted" />
            </NavLink>

            <NavLink
              to="/testimonials"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <FiStar size={18} className="text-primary" />
                <span>Reviews</span>
              </span>
              <FiChevronRight size={16} className="text-muted" />
            </NavLink>

            <NavLink
              to="/contact"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <FiMail size={18} className="text-primary" />
                <span>Contact</span>
              </span>
              <FiChevronRight size={16} className="text-muted" />
            </NavLink>

            <NavLink
              to="/wishlist"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span className="d-flex align-items-center gap-3">
                <RiHeartLine size={18} className="text-danger" />
                <span>Wishlist</span>
              </span>
              {wishlistQuantity > 0 ? (
                <span className="badge bg-danger rounded-pill px-2 py-1 small">
                  {wishlistQuantity}
                </span>
              ) : (
                <FiChevronRight size={16} className="text-muted" />
              )}
            </NavLink>
          </div>

          <div className="mt-auto pt-3 border-top">
            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border mb-3">
              <span className="small fw-semibold text-dark">
                {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 fw-semibold"
                onClick={toggleTheme}
              >
                Switch
              </button>
            </div>

            <div className="text-center text-muted" style={{ fontSize: '0.78rem' }}>
              ⚡ Free express delivery on orders over $50
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}