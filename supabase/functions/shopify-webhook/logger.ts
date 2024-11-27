export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  
  webhook: (topic: string, status: 'received' | 'processed' | 'failed', details?: any) => {
    console.log(`[WEBHOOK] ${topic} - ${status}`, details ? JSON.stringify(details) : '');
  }
};