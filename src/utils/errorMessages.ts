interface ErrorMessages {
  [key: string]: {
    en: string;
    pt: string;
  };
}

export const errorMessages: ErrorMessages = {
  sessionError: {
    en: "Session error. Please try logging in again.",
    pt: "Erro na sessão. Por favor, faça login novamente."
  },
  profileError: {
    en: "Error loading profile data. Please refresh the page.",
    pt: "Erro ao carregar dados do perfil. Por favor, atualize a página."
  },
  createError: {
    en: "Error creating profile. Please try again.",
    pt: "Erro ao criar perfil. Por favor, tente novamente."
  },
  networkError: {
    en: "Network error. Please check your connection.",
    pt: "Erro de conexão. Por favor, verifique sua internet."
  }
};