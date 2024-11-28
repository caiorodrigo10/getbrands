import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://skrvprmnncxpkojraoem.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnZwcm1ubmN4cGtvanJhb2VtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTUwNDI2NCwiZXhwIjoyMDQ3MDgwMjY0fQ.MeT3SqrNFjhffSm3DBMAo2TNDxlKaUT38pN9xey8oJo";

// Cliente com permissões administrativas
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

// Funções auxiliares para gerenciar tabelas
export const supabaseUtils = {
  // Criar novo usuário
  async createUser(email: string, password: string, userData?: any) {
    try {
      // 1. Criar usuário no auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) throw authError;

      // 2. Se tiver dados adicionais, criar perfil do usuário
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
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  // Inserir dados em uma tabela
  async insertData(tableName: string, data: any) {
    const { data: result, error } = await supabaseAdmin
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Atualizar dados em uma tabela
  async updateData(tableName: string, match: Record<string, any>, data: any) {
    const { data: result, error } = await supabaseAdmin
      .from(tableName)
      .update(data)
      .match(match)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Deletar dados de uma tabela
  async deleteData(tableName: string, match: Record<string, any>) {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .match(match)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Buscar dados de uma tabela
  async getData(tableName: string, query?: {
    select?: string,
    match?: Record<string, any>,
    limit?: number,
    offset?: number,
    order?: { column: string, ascending?: boolean }
  }) {
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
  }
};
