
import { OnboardingQuizPT } from "@/pages/pt/OnboardingQuiz";
import { useEffect } from "react";

const ComecarPT = () => {
  useEffect(() => {
    // Track ViewContent event
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Começar Quiz PT',
        content_category: 'Quiz',
        language: 'pt'
      });
    }
    
    // Adiciona log para debug
    console.log('[DEBUG] ComecarPT - Renderizado');
  }, []);

  return <OnboardingQuizPT />;
};

export default ComecarPT;
