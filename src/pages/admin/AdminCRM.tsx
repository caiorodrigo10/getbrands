
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { CRMTable } from "@/components/admin/crm/CRMTable";
import { ImportContactsDialog } from "@/components/admin/crm/ImportContactsDialog";
import { toast } from "sonner";
import AdminPagination from "@/components/admin/AdminPagination";

const AdminCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ["crm-users", page, pageSize],
    queryFn: async () => {
      try {
        console.log("[AdminCRM] Fetching CRM users data for page:", page, "with pageSize:", pageSize);
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        // Use supabaseAdmin instead of regular supabase client to bypass RLS policies
        const { data, error, count } = await supabaseAdmin
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url,
            role,
            created_at,
            projects:projects(
              id,
              name,
              status,
              pack_type
            )
          `, { count: 'exact' })
          .range(from, to)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("[AdminCRM] Error fetching data:", error);
          throw error;
        }
        
        console.log("[AdminCRM] Successfully fetched data:", { 
          recordCount: data?.length || 0, 
          totalCount: count || 0
        });
        
        return {
          users: data || [],
          totalUsers: count || 0,
          pageCount: Math.ceil((count || 0) / pageSize)
        };
      } catch (err) {
        console.error("[AdminCRM] Unexpected error:", err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    retry: 2
  });

  useEffect(() => {
    if (error) {
      console.error("[AdminCRM] Error in useQuery:", error);
      toast.error("Could not load user data. Please try again.");
    }
  }, [error]);

  const filteredUsers = usersData?.users.filter((user) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (user.email?.toLowerCase().includes(searchLower)) ||
      (user.phone?.toLowerCase().includes(searchLower))
    );
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Customer Relationship Management</h1>
        <div className="mt-8 text-center p-4 border rounded-md">
          <p className="text-red-500 mb-2">Error loading data</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

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

      {filteredUsers && filteredUsers.length > 0 ? (
        <>
          <CRMTable 
            users={filteredUsers || []} 
            onUserUpdated={refetch}
            totalUsers={usersData?.totalUsers || 0}
          />
          
          {usersData?.pageCount && usersData.pageCount > 1 && (
            <AdminPagination
              page={page}
              pageCount={usersData.pageCount}
              pageSize={pageSize}
              totalItems={usersData.totalUsers}
              onPageChange={handlePageChange}
              setPageSize={setPageSize}
            />
          )}
        </>
      ) : (
        <div className="text-center p-6 border rounded-md">
          {searchTerm ? 'No users found matching your search' : 'No users found'}
        </div>
      )}

      <ImportContactsDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
};

export default AdminCRM;
