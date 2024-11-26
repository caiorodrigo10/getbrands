import { logger } from './logger.ts';

const generateHmacSha256 = async (message: string, key: string): Promise<string> => {
  try {
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
  } catch (error) {
    logger.error('Error generating HMAC', error);
    throw error;
  }
};

export const validateShopifyHmac = async (
  hmac: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> => {
  if (!hmac) {
    logger.error('Missing HMAC header');
    return false;
  }
  
  try {
    logger.info('Validating HMAC', { 
      receivedHmac: hmac,
      bodyLength: rawBody.length 
    });

    const generatedHash = await generateHmacSha256(rawBody, secret);
    const isValid = generatedHash === hmac;

    if (!isValid) {
      logger.error('HMAC validation failed', {
        receivedHmac: hmac,
        generatedHmac: generatedHash
      });
    }

    return isValid;
  } catch (error) {
    logger.error('Error during HMAC validation', error);
    return false;
  }
};