import { logger } from './logger.ts';

const generateHmacSha256 = async (message: string, key: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    logger.info('V2: HMAC Generation Details', {
      messageLength: message.length,
      messageSample: message.substring(0, 100),
      keyLength: key.length
    });

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

    const hash = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    logger.info('V2: Generated HMAC hash', { hash });
    
    return hash;
  } catch (error) {
    logger.error('V2: Error generating HMAC', error);
    throw error;
  }
};

export const validateShopifyHmac = async (
  hmac: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> => {
  if (!hmac) {
    logger.error('V2: Missing HMAC header');
    return false;
  }
  
  try {
    logger.info('V2: Starting HMAC validation', { 
      receivedHmac: hmac,
      bodyLength: rawBody.length,
      bodySample: rawBody.substring(0, 100),
      secretLength: secret.length
    });

    const generatedHash = await generateHmacSha256(rawBody, secret);
    const isValid = generatedHash === hmac;

    if (!isValid) {
      logger.error('V2: HMAC validation failed', {
        receivedHmac: hmac,
        generatedHmac: generatedHash,
        hashesMatch: isValid
      });
    } else {
      logger.info('V2: HMAC validation successful');
    }

    return isValid;
  } catch (error) {
    logger.error('V2: Error during HMAC validation', error);
    return false;
  }
};