export const formatPhoneForShopify = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Ensure we have at least 10 digits (minimum required for Shopify)
  if (digits.length < 10) {
    return '';
  }

  // Format as +1XXXXXXXXXX for US numbers or +XXXXXXXXXXX for international
  // Shopify expects E.164 format
  if (digits.startsWith('1') && digits.length === 11) {
    return `+${digits}`;
  } else if (digits.length === 10) {
    return `+1${digits}`;
  } else {
    return `+${digits}`;
  }
};