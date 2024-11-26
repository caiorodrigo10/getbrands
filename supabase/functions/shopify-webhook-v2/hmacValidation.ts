import { logger } from './logger.ts';

const generateHmacSha256 = async (message: string, key: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    logger.debug('HMAC Generation Input', {
      messageLength: message.length,
      messageSample: message.substring(0, 100),
      messageEncoding: 'UTF-8',
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
    
    logger.debug('HMAC Generation Output', { 
      generatedHash: hash,
      hashLength: hash.length,
      encoding: 'base64'
    });
    
    return hash;
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
    logger.error('Missing HMAC header', { headers: 'x-shopify-hmac-sha256 not found' });
    return false;
  }
  
  try {
    logger.debug('Starting HMAC validation', { 
      receivedHmac: hmac,
      bodyLength: rawBody.length,
      bodySample: rawBody.substring(0, 100),
      bodyHash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawBody)).then(hash => 
        Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
      ),
      secretLength: secret.length
    });

    const generatedHash = await generateHmacSha256(rawBody, secret);
    const isValid = generatedHash === hmac;

    logger.debug('HMAC Validation Result', {
      receivedHmac: hmac,
      generatedHmac: generatedHash,
      hashesMatch: isValid,
      validationResult: isValid ? 'SUCCESS' : 'FAILED'
    });

    return isValid;
  } catch (error) {
    logger.error('Error during HMAC validation', error);
    return false;
  }
};