// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://skrvprmnncxpkojraoem.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnZwcm1ubmN4cGtvanJhb2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDQyNjQsImV4cCI6MjA0NzA4MDI2NH0.v2fnMj0VBBTMDv_Rm6yOgePhDjyDSTo2ls3LPVh9jXA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);