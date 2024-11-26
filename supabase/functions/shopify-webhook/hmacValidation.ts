const generateHmacSha256 = async (message: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    messageData
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

export const validateShopifyHmac = async (
  hmac: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> => {
  if (!hmac) return false;
  
  const generatedHash = await generateHmacSha256(rawBody, secret);
  return generatedHash === hmac;
};