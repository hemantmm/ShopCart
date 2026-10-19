import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Order } from '../types/order';

type OrderHistoryContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  clearOrderHistory: () => void;
  totalOrdersCount: number;
};

const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: 'SC-819240',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
      cardLast4: '4242'
    },
    items: [
      {
        id: 1,
        name: 'nike jordan',
        price: 500.99,
        quantity: 1,
        imgUrl: '/imgs/nikejordan.png',
        category: 'shoes'
      },
      {
        id: 2,
        name: 'IKIGAI',
        price: 69,
        quantity: 1,
        imgUrl: '/imgs/book2.png',
        category: 'books'
      }
    ],
    subtotal: 569.99,
    discountAmount: 50,
    couponCode: 'FLAT50',
    shippingCost: 0,
    total: 519.99,
    status: 'delivered',
    trackingNumber: 'TRK-SC-94821045',
    carrier: 'FedEx Priority 2-Day',
    estimatedDelivery: 'Delivered'
  }
];

function isOrders(value: unknown): value is Order[] {
  return (
    Array.isArray(value) &&
    value.every(
      (order) =>
        typeof order === 'object' &&
        order !== null &&
        typeof order.id === 'string' &&
        typeof order.total === 'number' &&
        Array.isArray(order.items)
    )
  );
}

const OrderHistoryContext = createContext<OrderHistoryContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useOrderHistory() {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('useOrderHistory must be used within an OrderHistoryProvider');
  }
  return context;
}

export function OrderHistoryProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>(
    'shopcart_order_history',
    INITIAL_SEED_ORDERS,
    isOrders
  );

  const addOrder = useCallback((newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  }, [setOrders]);

  const getOrderById = useCallback((id: string) => {
    return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  }, [orders]);

  const clearOrderHistory = useCallback(() => {
    setOrders([]);
  }, [setOrders]);

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      getOrderById,
      clearOrderHistory,
      totalOrdersCount: orders.length
    }),
    [orders, addOrder, getOrderById, clearOrderHistory]
  );

  return (
    <OrderHistoryContext.Provider value={value}>
      {children}
    </OrderHistoryContext.Provider>
  );
}
