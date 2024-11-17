import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Gleap from 'gleap'
import { supabase } from '@/integrations/supabase/client'

// Initialize Gleap
Gleap.initialize("qqAquIhEn19VOadZnGz2Xg48r3NoXdas");

// Função para atualizar os dados do usuário no Gleap
const updateGleapUserData = async (userId: string) => {
  try {
    // Buscar dados do perfil e projeto atual do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    const currentProject = projects?.[0];

    // Configurar dados do usuário no Gleap
    Gleap.identify(userId, {
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      value: 0,
      plan: '',
      language: 'pt-br',
      companyId: currentProject?.id || '',
      companyName: currentProject?.name || '',
    });

  } catch (error) {
    console.error('Error updating Gleap user data:', error);
  }
};

// Observar mudanças na autenticação
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    updateGleapUserData(session.user.id);
  } else if (event === 'SIGNED_OUT') {
    Gleap.clearIdentity();
  }
});

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)