export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  
  webhook: (topic: string, status: 'received' | 'processed' | 'failed', details?: any) => {
    console.log(`[WEBHOOK] ${topic} - ${status}`, details ? JSON.stringify(details, null, 2) : '');
  },

  debug: (message: string, data: any) => {
    console.log(`[DEBUG] ${message}`, JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }, null, 2));
  }
};