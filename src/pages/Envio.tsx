import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import type { ShippingFormData } from "@/types/shipping";

const formSchema = z.object({
  firstName: z.string().min(2, "Nome muito curto"),
  lastName: z.string().min(2, "Sobrenome muito curto"),
  address1: z.string().min(5, "Endereço muito curto"),
  address2: z.string().optional(),
  city: z.string().min(2, "Cidade muito curta"),
  state: z.string().min(2, "Estado inválido"),
  zipCode: z.string().min(5, "CEP inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

const Envio = () => {
  const navigate = useNavigate();
  const form = useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    },
  });

  const onSubmit = (values: ShippingFormData) => {
    console.log(values);
    navigate("/pagamento");
  };

  return (
    <div className="p-8 bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Informações de Envio</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <AddressFields form={form} />
            <ContactFields form={form} />

            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white w-full md:w-auto"
              >
                Prosseguir para Pagamento
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Envio;