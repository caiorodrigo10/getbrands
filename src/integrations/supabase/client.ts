import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://skrvprmnncxpkojraoem.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnZwcm1ubmN4cGtvanJhb2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDQyNjQsImV4cCI6MjA0NzA4MDI2NH0.MeT3SqrNFjhffSm3DBMAo2TNDxlKaUT38pN9xey8oJo";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  // Add retry configuration
  maxRetryCount: 3,
  retryInterval: 1000
});