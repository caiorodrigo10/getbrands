import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const Shipping = () => {
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
    navigate("/checkout/payment");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Informações de Envio</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <AddressFields form={form} />
            <ContactFields form={form} />

            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="w-full md:w-auto"
              >
                Continuar para pagamento
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Shipping;