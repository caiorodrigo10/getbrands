import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Calendar as CalendarIcon, Package, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_products (
            id,
            product: products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return projectData;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const stages = [
    {
      title: "Onboarding",
      description: "Agende uma chamada com nosso time para iniciarmos seu projeto",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Selecione uma data para a chamada:</p>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <Button className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Agendar Chamada
          </Button>
        </div>
      ),
    },
    {
      title: "Seleção de Produtos",
      description: "Escolha os produtos para seu projeto",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {project?.project_products?.length || 0} produtos selecionados
            </p>
            <Button onClick={() => navigate("/catalogo")} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produtos
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project?.project_products?.map((item) => (
              <Card key={item.id} className="p-4 flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span>{item.product.name}</span>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Naming",
      description: "Desenvolvimento do nome da sua marca",
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Em desenvolvimento pelo nosso time.</p>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" />
            <span>Pesquisa de mercado</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" />
            <span>Brainstorming de nomes</span>
          </div>
        </div>
      ),
    },
    {
      title: "Identidade Visual",
      description: "Criação da identidade visual da sua marca",
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Aguardando conclusão da etapa anterior.</p>
        </div>
      ),
    },
    {
      title: "Criação de Embalagens",
      description: "Design das embalagens dos seus produtos",
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Aguardando conclusão da etapa anterior.</p>
        </div>
      ),
    },
    {
      title: "E-commerce",
      description: "Implementação da sua loja online",
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Aguardando conclusão da etapa anterior.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <Button variant="outline" onClick={() => navigate("/projetos")}>
          Voltar
        </Button>
      </div>

      <div className="grid gap-4">
        {stages.map((stage, index) => (
          <Collapsible key={stage.title}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-6">
                  <div className="space-y-1 text-left">
                    <h3 className="text-xl font-semibold">{stage.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t px-6 pb-6 pt-4">
                  {stage.content}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;