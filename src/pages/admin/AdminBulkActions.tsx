import { ImportProductsDialog } from "@/components/admin/bulk-actions/ImportProductsDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShopifyWebhookTester } from "@/components/admin/shopify/ShopifyWebhookTester";
import { ShopifyWebhookTest } from "@/components/admin/bulk-actions/ShopifyWebhookTest";
import { Separator } from "@/components/ui/separator";

const AdminBulkActions = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold">Ações em Lote</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie importações e ações em lote
        </p>
      </div>

      <div className="space-y-4">
        <Button onClick={() => setShowImportDialog(true)}>
          Importar Produtos
        </Button>

        <ImportProductsDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Webhooks do Shopify</h2>
        <div className="space-y-8">
          <ShopifyWebhookTest />
          <ShopifyWebhookTester />
        </div>
      </div>
    </div>
  );
};

export default AdminBulkActions;