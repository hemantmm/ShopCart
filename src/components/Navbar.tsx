import { Container, Nav, Navbar as NavbarBs } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { RiShoppingBag3Fill, RiHeartLine, RiHeartFill, RiSunFill, RiMoonClearFill } from 'react-icons/ri';
import { FiShoppingBag } from 'react-icons/fi';

export function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();
  const { wishlistQuantity } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <NavbarBs sticky='top' className='shopcart-navbar shadow-sm mb-4 py-3'>
      <Container fluid="lg" className="d-flex align-items-center justify-content-between">
        <NavLink to='/' className='brand-badge d-flex align-items-center gap-2'>
          <RiShoppingBag3Fill size={28} style={{ color: '#4f46e5' }} />
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

        <div className="d-flex align-items-center gap-3">
          <Nav className='d-flex d-md-none'>
            <Nav.Link to='/store' as={NavLink} className='nav-link-custom px-2'>
              Store
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="navbar-icon-btn theme-toggle"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <RiSunFill size={20} /> : <RiMoonClearFill size={20} />}
            </button>

            {/* Wishlist Button */}
            <div className="wishlist-btn-wrapper position-relative">
              <Link
                to="/wishlist"
                className="navbar-icon-btn wishlist"
                title="View Wishlist"
                aria-label={`View wishlist${wishlistQuantity > 0 ? `, ${wishlistQuantity} items` : ''}`}
              >
                {wishlistQuantity > 0 ? <RiHeartFill size={20} /> : <RiHeartLine size={20} />}
                {wishlistQuantity > 0 && (
                  <span className="cart-badge-count bg-danger">{wishlistQuantity}</span>
                )}
              </Link>
            </div>

            {/* Cart Button */}
            <div className="cart-btn-wrapper position-relative">
              <button
                type="button"
                onClick={openCart}
                className="navbar-icon-btn cart"
                title="View Cart"
                aria-label={`View cart${cartQuantity > 0 ? `, ${cartQuantity} items` : ''}`}
              >
                <FiShoppingBag size={20} />
                {cartQuantity > 0 && (
                  <span className="cart-badge-count">{cartQuantity}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </NavbarBs>
  );
}