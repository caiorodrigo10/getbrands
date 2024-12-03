export const calculateOrderSubtotal = (products: Array<any>) => {
  return products.reduce((total, item) => {
    const price = item.unit_price || item.product?.from_price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

export const calculateShippingCost = (products: Array<any>) => {
  const totalItems = products.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  if (totalItems <= 3) {
    return 4.50;  // Updated base rate from 10.00 to 4.50
  } else if (totalItems <= 6) {
    return 14.00;
  } else {
    const extraItems = totalItems - 6;
    return 14.00 + (extraItems * 2.50);
  }
};

export const calculateOrderTotal = (products: Array<any>, historicalShippingCost?: number) => {
  const subtotal = calculateOrderSubtotal(products);
  const shipping = historicalShippingCost ?? calculateShippingCost(products);
  return subtotal + shipping;
};