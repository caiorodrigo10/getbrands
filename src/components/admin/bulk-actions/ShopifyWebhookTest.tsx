import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ShopifyWebhookTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTestHmac = async (data: string) => {
    const encoder = new TextEncoder();
    const key = 'test-secret-key'; // Using a test key since this is just for testing
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  };

  const handleTestWebhook = async () => {
    setIsLoading(true);
    try {
      const testData = {
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
      };

      // Generate HMAC for the request body
      const hmac = await generateTestHmac(JSON.stringify(testData));

      const { data, error } = await supabase.functions.invoke('shopify-webhook', {
        body: {
          topic: "products/create",
          data: testData
        },
        headers: {
          'x-shopify-topic': 'products/create',
          'x-shopify-hmac-sha256': hmac,
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