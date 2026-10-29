export type OrderStatus = 'processing' | 'dispatched' | 'in_transit' | 'delivered';

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string;
  category?: string;
  selectedVariants?: Record<string, string>;
};

export type OrderCustomer = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardLast4?: string;
};

export type OrderTimelineEvent = {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
};

export type Order = {
  id: string; // e.g. "SC-842910"
  createdAt: string; // ISO string
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
};

