import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpFormFields } from "@/components/auth/signup/SignUpFormFields";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface SignUpFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export const SignUpForm = ({ onSubmit, isLoading, onBack }: SignUpFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState({
    password: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      password: "",
      phone: "",
    };
    let isValid = true;

    if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Número de telefone é obrigatório";
      isValid = false;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      isValid = false;
      toast.error("Por favor, preencha todos os campos");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Estamos Quase Lá!
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Preencha seus dados abaixo para desbloquear acesso ao nosso catálogo completo de produtos
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <SignUpFormFields 
          formData={formData}
          errors={errors}
          setFormData={setFormData}
        />

        <div className="flex flex-col items-center space-y-4">
          <Button
            type="submit"
            className="w-auto px-6"
            disabled={isLoading}
          >
            {isLoading ? "Criando..." : "Acessar Catálogo de Produtos"}
          </Button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};