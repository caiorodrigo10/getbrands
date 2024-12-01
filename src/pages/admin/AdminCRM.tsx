import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { CRMTable } from "@/components/admin/crm/CRMTable";
import { ImportContactsDialog } from "@/components/admin/crm/ImportContactsDialog";

const ITEMS_PER_PAGE = 15;

const AdminCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Customer Relationship Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all users and their projects
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="outline"
          onClick={() => setShowImportDialog(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import Contacts
        </Button>
      </div>

      <CRMTable />

      <ImportContactsDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
};

export default AdminCRM;