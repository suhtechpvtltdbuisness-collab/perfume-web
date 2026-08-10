export type OrderStatus = "created" | "paid" | "failed";

export interface OrderItem {
  perfumeId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface OrderAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  total: number;
  currency: string;
  status: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: { perfumeId: string; quantity: number }[];
  couponCode?: string | null;
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
  razorpay: {
    key: string;
    orderId: string;
    amount: number;
    currency: string;
  };
}
