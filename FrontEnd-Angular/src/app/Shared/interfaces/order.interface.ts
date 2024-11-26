export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    productName?: string;
    subtotal?: number;
}

export interface Order {
    id?: number;
    status?: string;
    totalAmount: number;
    orderDate?: string;
    items: OrderItem[];
    paymentMethod?: PaymentMethod;
    transactionReference?: string;
}

export interface OrderHistory {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
}

export enum PaymentMethod {
    Cash = 'CASH',
    PayPal = 'PAYPAL'
}
export enum OrderStatus{
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED'
}
