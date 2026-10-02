import { Button, Container, Nav, Navbar as NavbarBs } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useWishlist } from '../context/WishlistContext';
import { RiShoppingBag3Fill, RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { FiShoppingBag } from 'react-icons/fi';

export function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();
  const { wishlistQuantity } = useWishlist();

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
          
          <div className="d-flex gap-2">
            <div className="wishlist-btn-wrapper position-relative">
              <Link
                to="/wishlist"
                className='btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center border-2 p-0'
                style={{
                  width: '2.85rem',
                  height: '2.85rem',
                  borderColor: '#ffe4e6',
                  color: '#e11d48',
                  background: '#ffffff'
                }}
                title="View Wishlist"
              >
                {wishlistQuantity > 0 ? <RiHeartFill size={20} /> : <RiHeartLine size={20} />}
                {wishlistQuantity > 0 && (
                  <span className="cart-badge-count bg-danger">{wishlistQuantity}</span>
                )}
              </Link>
            </div>

            <div className="cart-btn-wrapper position-relative">
              <Button
                onClick={openCart}
                variant='outline-primary'
                className='rounded-circle d-flex align-items-center justify-content-center border-2 p-0'
                style={{
                  width: '2.85rem',
                  height: '2.85rem',
                  borderColor: '#e0e7ff',
                  color: '#4f46e5',
                  background: '#ffffff'
                }}
                title="View Cart"
                aria-label={`View cart${cartQuantity > 0 ? `, ${cartQuantity} items` : ''}`}
              >
                <FiShoppingBag size={20} />
                {cartQuantity > 0 && (
                  <span className="cart-badge-count">{cartQuantity}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </NavbarBs>
  );
}