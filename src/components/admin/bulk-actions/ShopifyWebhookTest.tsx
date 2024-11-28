import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ShopifyWebhookTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestWebhook = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-webhook', {
        body: {
          topic: "products/create",
          data: {
            id: "test-" + Date.now(),
            title: "Test Product " + new Date().toLocaleString(),
            body_html: "<p>Test product description</p>",
            variants: [{
              price: "99.99",
              compare_at_price: "129.99",
              id: "variant-" + Date.now(),
              inventory_item_id: "test-inventory-" + Date.now()
            }],
            images: [{
              src: "https://placekitten.com/200/200",
              position: 1
            }]
          }
        },
        headers: {
          'x-shopify-topic': 'products/create',
          'x-shopify-hmac-sha256': 'test-hmac-' + Date.now(),
          'x-shopify-shop-domain': 'test-shop.myshopify.com'
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test webhook sent successfully",
      });

    } catch (error) {
      console.error('Error sending test webhook:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send test webhook",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Test Webhook</h3>
          <p className="text-sm text-muted-foreground">
            Send a test product creation webhook
          </p>
        </div>
        <Button 
          onClick={handleTestWebhook}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Test Webhook"}
        </Button>
      </div>
    </div>
  );
};