import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ShopifyWebhookTester = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegisterWebhooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-register-webhooks');
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Webhooks registrados com sucesso",
      });
      
      // Automatically fetch the list after registering
      await handleListWebhooks();
    } catch (error) {
      console.error('Erro ao registrar webhooks:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao registrar webhooks",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleListWebhooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-list-webhooks');
      
      if (error) throw error;
      
      setWebhooks(data?.webhooks || []);
    } catch (error) {
      console.error('Erro ao listar webhooks:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao listar webhooks",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch webhooks when component mounts
  useEffect(() => {
    handleListWebhooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button 
          onClick={handleRegisterWebhooks} 
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Registrar Webhooks"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleListWebhooks}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Atualizar Lista"}
        </Button>
      </div>

      {webhooks.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Webhooks Registrados</h3>
          <ScrollArea className="h-[300px]">
            {webhooks.map((webhook: any, index: number) => (
              <div 
                key={webhook.node.id} 
                className="p-4 border-b last:border-b-0"
              >
                <p><strong>Tópico:</strong> {webhook.node.topic}</p>
                <p><strong>URL:</strong> {webhook.node.callbackUrl}</p>
                <p><strong>Formato:</strong> {webhook.node.format}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};