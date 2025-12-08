export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface MenuItem {
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  waiterName: string;
  customerName?: string;
}
