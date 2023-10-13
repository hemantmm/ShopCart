import React, { useState } from 'react';
import { Button, Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { CartItem } from './CartItem';
import { formatCurrency } from '../utilities/formatCurrency';
import storeItems from '../data/items.json';

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems, clearCart } = useShoppingCart();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const calculateTotalCost = () => {
    const total = cartItems.reduce((total, cartItem) => {
      const item = storeItems.find(i => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearCart();

    alert('Your payment has been processed successfully!');

    window.location.href = '/';
  };

  return (
    <Offcanvas show={isOpen && cartItems.length > 0} onHide={closeCart} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Cart
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          <Stack gap={3}>
            {cartItems.map(item => (
              <CartItem key={item.id} {...item} />
            ))}
            <div className="ms-auto fw-bold fs-5">
              Total {formatCurrency(calculateTotalCost())}
            </div>
            <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="text"
                name="name"
                placeholder="Name"
                value={shippingInfo.name}
                onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="text"
                name="state"
                placeholder="State"
                value={shippingInfo.state}
                onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="number"
                name="zip"
                placeholder="Zip"
                value={shippingInfo.zip}
                onChange={e => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
              />
              <br />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="number"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="number"
                name="expirationDate"
                placeholder="Expiration Date (MM/YY)"
                value={paymentDetails.expirationDate}
                onChange={e => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
              />
              <input
                style={{padding:"0.5rem", border:"1px solid #ccc", borderRadius:"4px"}}
                required
                type="number"
                name="cvv"
                placeholder="CVV"
                value={paymentDetails.cvv}
                onChange={e => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
              />
              <br />
              <Button type='submit'>Checkout</Button>
            </form>
          </Stack>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
