export interface CustomerData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface OrderData {
  order_id: string;
  revenue: number;
  currency: string;
  payment_method: string;
  products: Array<{
    product_id: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
  customer?: CustomerData;
}

export interface TrackingData {
  url?: string;
  path?: string;
  timestamp?: string;
  [key: string]: any;
}