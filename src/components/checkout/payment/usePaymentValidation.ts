export const validateZipCode = (zip: string | null) => {
  if (!zip) return false;
  const brZipRegex = /^\d{5}-?\d{3}$/;
  const usZipRegex = /^\d{5}(-\d{4})?$/;
  return brZipRegex.test(zip) || usZipRegex.test(zip);
};

export const validateShippingInfo = (
  shippingZip: string,
  billingZip: string | undefined,
  useSameForBilling: boolean
) => {
  if (!validateZipCode(shippingZip)) {
    throw new Error("CEP de entrega inválido. Use o formato: 12345-678");
  }

  if (!useSameForBilling && billingZip && !validateZipCode(billingZip)) {
    throw new Error("CEP de cobrança inválido. Use o formato: 12345-678");
  }
};