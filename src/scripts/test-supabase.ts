import { testCreateUser } from '../lib/supabase/test';

console.log('🚀 Iniciando teste do Supabase...');

testCreateUser()
  .then(() => {
    console.log('✅ Teste concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  });
