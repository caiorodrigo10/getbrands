import { useShippingCalculation } from "@/hooks/useShippingCalculation";

export const calculateOrderSubtotal = (products: Array<any>) => {
  return products.reduce((total, item) => {
    const price = item.product?.from_price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

// Esta função só deve ser usada para cálculos em tempo real (carrinho/checkout)
export const calculateShippingCost = (products: Array<any>) => {
  const totalItems = products.length;
  
  if (totalItems <= 3) {
    return 10.00;
  } else if (totalItems <= 6) {
    return 14.00;
  } else {
    const extraItems = totalItems - 6;
    return 14.00 + (extraItems * 2.50);
  }
};

export const calculateOrderTotal = (products: Array<any>, historicalShippingCost?: number) => {
  const subtotal = calculateOrderSubtotal(products);
  // Se tiver um valor histórico de frete, use-o
  const shipping = historicalShippingCost ?? calculateShippingCost(products);
  return subtotal + shipping;
};