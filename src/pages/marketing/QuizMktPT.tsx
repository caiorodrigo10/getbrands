import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStepMktPT } from "./steps/WelcomeStepMktPT";
import { ProductCategoriesStepMktPT } from "./steps/ProductCategoriesStepMktPT";
import { ProfileTypeStepMktPT } from "./steps/ProfileTypeStepMktPT";
import { BrandStatusStepMktPT } from "./steps/BrandStatusStepMktPT";
import { LaunchUrgencyStepMktPT } from "./steps/LaunchUrgencyStepMktPT";

type Step = {
  component: React.ComponentType<any>;
  props: Record<string, any>;
  autoAdvance?: boolean;
  name: string;
};

export function QuizMktPT() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({
    productCategories: [] as string[],
    profileType: "",
    brandStatus: "",
    launchUrgency: "",
    email: "",
    phone: "",
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      // Primeiro criar o usuário com os dados básicos
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: quizData.email,
        password: "Temp123!", // Senha temporária que o usuário deverá alterar
        options: {
          data: {
            phone: quizData.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Atualizar o perfil com os dados do quiz
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: quizData.phone,
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency,
            language: 'pt',
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success("Cadastro realizado com sucesso!");
        navigate("/pt/login");
      }
    } catch (error: any) {
      console.error("Erro ao salvar respostas:", error);
      toast.error(error.message || "Falha ao salvar respostas");
    }
  };

  const steps: Step[] = [
    {
      component: WelcomeStepMktPT,
      name: "Bem-vindo",
      props: {
        onNext: handleNext,
      },
      autoAdvance: true,
    },
    {
      component: ProductCategoriesStepMktPT,
      name: "Categorias de Produtos",
      props: {
        selected: quizData.productCategories,
        onAnswer: (value: string[]) => {
          setQuizData({ ...quizData, productCategories: value });
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: false,
    },
    {
      component: ProfileTypeStepMktPT,
      name: "Tipo de Perfil",
      props: {
        selected: quizData.profileType,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, profileType: value });
          if (steps[2].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: BrandStatusStepMktPT,
      name: "Status da Marca",
      props: {
        selected: quizData.brandStatus,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, brandStatus: value });
          if (steps[3].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: LaunchUrgencyStepMktPT,
      name: "Urgência de Lançamento",
      props: {
        selected: quizData.launchUrgency,
        email: quizData.email,
        phone: quizData.phone,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, launchUrgency: value });
        },
        onEmailChange: (email: string) => {
          setQuizData({ ...quizData, email });
        },
        onPhoneChange: (phone: string) => {
          setQuizData({ ...quizData, phone });
        },
        onComplete: handleComplete,
        onBack: handleBack,
      },
      autoAdvance: false,
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CurrentStepComponent {...steps[currentStep].props} />
    </div>
  );
}

export default QuizMktPT;