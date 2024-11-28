import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ShopifyWebhookTester = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [shopifyLogs, setShopifyLogs] = useState<any[]>([]);
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

  const handleSyncCosts = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando sincronização de custos...');
      const { data, error } = await supabase.functions.invoke('shopify-webhook-v2', {
        method: 'POST',
        body: { action: 'sync-costs' }
      });
      
      console.log('Resposta da função:', { data, error });
      
      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Sincronização de custos iniciada com sucesso",
      });
      
      // Refresh logs after sync
      await fetchLogs();
      
    } catch (error) {
      console.error('Erro completo ao sincronizar custos:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha ao sincronizar custos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      // Fetch webhook logs
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (webhookError) throw webhookError;
      setWebhookLogs(webhookData || []);

      // Fetch Shopify logs
      const { data: shopifyData, error: shopifyError } = await supabase
        .from('shopify_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (shopifyError) throw shopifyError;
      setShopifyLogs(shopifyData || []);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar logs",
      });
    }
  };

  // Fetch webhooks and logs when component mounts
  useEffect(() => {
    handleListWebhooks();
    fetchLogs();
    
    // Set up real-time subscription for webhook logs
    const webhookSubscription = supabase
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

    // Set up real-time subscription for Shopify logs
    const shopifySubscription = supabase
      .channel('shopify_logs_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'shopify_logs' 
        }, 
        (payload) => {
          setShopifyLogs(current => [payload.new, ...current].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      webhookSubscription.unsubscribe();
      shopifySubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Webhooks do Shopify</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie webhooks e sincronização
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            onClick={handleRegisterWebhooks}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrar Webhooks"}
          </Button>
          <Button 
            onClick={handleSyncCosts}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? "Sincronizando..." : "Sincronizar Custos"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks Registrados</TabsTrigger>
          <TabsTrigger value="webhook-logs">Logs de Webhook</TabsTrigger>
          <TabsTrigger value="shopify-logs">Logs do Shopify</TabsTrigger>
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

        <TabsContent value="webhook-logs">
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

        <TabsContent value="shopify-logs">
          <div className="border rounded-lg p-4">
            <ScrollArea className="h-[300px]">
              {shopifyLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-4 border-b last:border-b-0"
                >
                  <p><strong>Tópico:</strong> {log.topic}</p>
                  <p><strong>Status:</strong> {log.status}</p>
                  <p><strong>Data:</strong> {new Date(log.created_at).toLocaleString()}</p>
                  {log.error && (
                    <p className="text-destructive"><strong>Erro:</strong> {log.error}</p>
                  )}
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