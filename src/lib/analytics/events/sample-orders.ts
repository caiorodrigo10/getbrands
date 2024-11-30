import { trackEvent } from "../index";

interface SampleOrderEvent {
  orderId: string;
  userId: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingCost?: number;
  status?: string;
}

export const trackSampleOrderCreated = (data: SampleOrderEvent) => {
  trackEvent("Sample Order Created", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackSampleOrderUpdated = (data: SampleOrderEvent) => {
  trackEvent("Sample Order Updated", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackSampleOrderStatusChanged = (data: SampleOrderEvent) => {
  trackEvent("Sample Order Status Changed", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackSampleOrderShipped = (data: SampleOrderEvent & { trackingNumber: string }) => {
  trackEvent("Sample Order Shipped", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackSampleOrderCancelled = (data: Pick<SampleOrderEvent, 'orderId' | 'userId'> & { reason?: string }) => {
  trackEvent("Sample Order Cancelled", {
    ...data,
    timestamp: new Date().toISOString()
  });
};