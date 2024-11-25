import { useShippingCalculation } from "@/hooks/useShippingCalculation";

export const calculateOrderSubtotal = (products: Array<any>) => {
  return products.reduce((total, item) => {
    const price = item.product?.from_price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

export const calculateShippingCost = (products: Array<any>) => {
  // Use the shipping rates from the database
  // Base shipping cost is $10.00 for US orders
  const totalItems = products.length;
  return 10.00;
};

export const calculateOrderTotal = (products: Array<any>) => {
  const subtotal = calculateOrderSubtotal(products);
  const shipping = calculateShippingCost(products);
  return subtotal + shipping;
};