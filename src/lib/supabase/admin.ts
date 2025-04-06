
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://skrvprmnncxpkojraoem.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnZwcm1ubmN4cGtvanJhb2VtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTUwNDI2NCwiZXhwIjoyMDQ3MDgwMjY0fQ.MeT3SqrNFjhffSm3DBMAo2TNDxlKaUT38pN9xey8oJo";

// Client with admin privileges
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Helper functions for managing tables
export const supabaseUtils = {
  // Create new user
  async createUser(email: string, password: string, userData?: any) {
    try {
      // 1. Create user in auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) throw authError;

      // 2. If additional data provided, create user profile
      if (userData && authUser.user) {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authUser.user.id,
            ...userData,
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;
      }

      return authUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Insert data into a table
  async insertData<T>(tableName: keyof Database["public"]["Tables"], data: T) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(tableName)
        .insert(data)
        .select();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
  },

  // Update data in a table
  async updateData<T>(tableName: keyof Database["public"]["Tables"], match: Record<string, any>, data: T) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(tableName)
        .update(data)
        .match(match)
        .select();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  },

  // Delete data from a table
  async deleteData(tableName: keyof Database["public"]["Tables"], match: Record<string, any>) {
    try {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .match(match)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  },

  // Get data from a table with error handling
  async getData(tableName: keyof Database["public"]["Tables"], query?: {
    select?: string,
    match?: Record<string, any>,
    limit?: number,
    offset?: number,
    order?: { column: string, ascending?: boolean }
  }) {
    try {
      let request = supabaseAdmin
        .from(tableName)
        .select(query?.select || '*');

      if (query?.match) {
        request = request.match(query.match);
      }

      if (query?.limit) {
        request = request.limit(query.limit);
      }

      if (query?.offset) {
        request = request.range(query.offset, query.offset + (query?.limit || 10) - 1);
      }

      if (query?.order) {
        request = request.order(query.order.column, {
          ascending: query.order.ascending ?? true
        });
      }

      const { data, error } = await request;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting data from ${tableName}:`, error);
      throw error;
    }
  }
};
