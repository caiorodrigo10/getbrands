import { supabaseAdmin } from './admin';

async function checkProfilesTable() {
  try {
    console.log('🔍 Verificando estrutura da tabela profiles...');
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro ao verificar tabela profiles:', error);
      throw error;
    }

    console.log('✅ Estrutura da tabela profiles:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error);
    throw error;
  }
}

export async function testCreateUser() {
  try {
    console.log('🔍 Criando novo usuário...');
    
    const email = `teste${Date.now()}@exemplo.com`;
    const password = 'Senha@123';
    const userData = {
      full_name: 'Usuário Teste',
      role: 'member'
    };

    // 1. Criar usuário na autenticação
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    });

    if (authError) {
      console.error('Erro ao criar usuário na autenticação:', authError);
      throw authError;
    }

    // 2. Criar perfil do usuário
    if (authUser?.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.user.id,
          name: userData.full_name,
          role: userData.role,
          email: authUser.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Erro ao criar perfil do usuário:', profileError);
        throw profileError;
      }
    }

    console.log('✅ Usuário criado com sucesso:', {
      id: authUser?.user?.id,
      email: authUser?.user?.email,
      metadata: authUser?.user?.user_metadata
    });
    return authUser;
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    throw error;
  }
}

// Executar os testes
checkProfilesTable()
  .then(() => testCreateUser());
