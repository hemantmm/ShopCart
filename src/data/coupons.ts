export type CouponDefinition = {
  code: string;
  label: string;
  description: string;
  type: 'percent' | 'flat' | 'shipping';
  value: number;
  minOrder?: number;
};

export const AVAILABLE_COUPONS: CouponDefinition[] = [
  {
    code: 'WELCOME10',
    label: '10% OFF',
    description: '10% off for new shoppers',
    type: 'percent',
    value: 10,
  },
  {
    code: 'FREESHIP',
    label: 'FREE DELIVERY',
    description: 'Free express delivery ($15 value)',
    type: 'shipping',
    value: 15,
  },
  {
    code: 'FLAT50',
    label: '$50 OFF',
    description: '$50 off on orders over $400',
    type: 'flat',
    value: 50,
    minOrder: 400,
  },
  {
    code: 'SHOPCART15',
    label: '15% OFF',
    description: '15% VIP member discount',
    type: 'percent',
    value: 15,
  },
];

