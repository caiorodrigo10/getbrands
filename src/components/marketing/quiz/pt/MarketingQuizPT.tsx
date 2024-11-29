import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { QuizQuestionPT } from "./QuizQuestionPT";
import { ComparisonResultsPT } from "./ComparisonResultsPT";
import { QuizIntroPT } from "./QuizIntroPT";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type QuizStep = {
  id: number;
  question: string;
  options: string[];
  type: "single" | "multiple";
};

const steps: QuizStep[] = [
  {
    id: 1,
    question: "Qual categoria de produto mais te interessa?",
    options: ["Cosméticos", "Café", "Suplementos", "Produtos Pet"],
    type: "single"
  },
  {
    id: 2,
    question: "Qual é o tamanho do seu mercado-alvo?",
    options: ["Local", "Regional", "Nacional", "Internacional"],
    type: "single"
  },
  {
    id: 3,
    question: "Você já tem uma marca?",
    options: ["Sim, marca completa", "Marca parcial", "Não, preciso de suporte total"],
    type: "single"
  },
  {
    id: 4,
    question: "Qual é seu objetivo principal com marca própria?",
    options: ["Renda Extra", "Projeto Pessoal", "Escalar Negócio", "Outro"],
    type: "single"
  }
];

export const MarketingQuizPT = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const progress = ((currentStep) / (steps.length + 2)) * 100;

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const saveQuizData = async () => {
    try {
      const { error } = await supabase
        .from('marketing_quiz_responses_pt')
        .insert({
          answers,
          email,
          phone,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success("Suas respostas foram salvas!");
    } catch (error) {
      console.error('Error saving quiz data:', error);
      toast.error("Falha ao salvar suas respostas");
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length) {
      if (!email || !phone) {
        toast.error("Por favor, preencha seu email e telefone");
        return;
      }
      await saveQuizData();
      setShowResults(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isContactStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Progress value={progress} className="h-2" />
        
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuizIntroPT onStart={() => setCurrentStep(1)} />
            </motion.div>
          )}

          {currentStep > 0 && !showResults && !isContactStep && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <QuizQuestionPT
                  step={steps[currentStep - 1]}
                  answer={answers[steps[currentStep - 1].id]}
                  onAnswer={(answer) => handleAnswer(steps[currentStep - 1].id, answer)}
                />
              </Card>
            </motion.div>
          )}

          {isContactStep && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-center">
                  Para receber seu resultado, informe seus dados de contato
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ComparisonResultsPT answers={answers} email={email} phone={phone} />
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep > 0 && !showResults && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-32"
            >
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              className="w-32"
              disabled={isContactStep ? !email || !phone : !answers[steps[currentStep - 1]?.id]}
            >
              {isContactStep ? "Ver Resultados" : "Próximo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};