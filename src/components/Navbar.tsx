import { Button, Container, Nav, Navbar as NavbarBs } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { FiShoppingBag } from 'react-icons/fi';

export function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();

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
          <div className="cart-btn-wrapper">
            <Button
              onClick={openCart}
              variant='outline-primary'
              className='rounded-circle d-flex align-items-center justify-content-center border-2'
              style={{
                width: '2.85rem',
                height: '2.85rem',
                borderColor: '#e0e7ff',
                color: '#4f46e5',
                background: '#ffffff'
              }}
              title="View Cart"
            >
              <FiShoppingBag size={20} />
              {cartQuantity > 0 && (
                <span className="cart-badge-count">{cartQuantity}</span>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </NavbarBs>
  );
}