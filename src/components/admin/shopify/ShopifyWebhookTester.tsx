import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ShopifyWebhookTester = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
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

  const fetchWebhookLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setWebhookLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar logs dos webhooks",
      });
    }
  };

  // Fetch webhooks and logs when component mounts
  useEffect(() => {
    handleListWebhooks();
    fetchWebhookLogs();
    
    // Set up real-time subscription for webhook logs
    const subscription = supabase
      .channel('webhook_logs_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'webhook_logs' 
        }, 
        (payload) => {
          setWebhookLogs(current => [payload.new, ...current].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks Registrados</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks">
          {webhooks.length > 0 && (
            <div className="border rounded-lg p-4">
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
        </TabsContent>

        <TabsContent value="logs">
          <div className="border rounded-lg p-4">
            <ScrollArea className="h-[300px]">
              {webhookLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-4 border-b last:border-b-0"
                >
                  <p><strong>Tópico:</strong> {log.topic}</p>
                  <p><strong>Data:</strong> {new Date(log.created_at).toLocaleString()}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-muted-foreground">
                      Ver payload
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};