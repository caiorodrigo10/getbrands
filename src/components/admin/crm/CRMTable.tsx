import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTableHeader } from "./components/UserTableHeader";
import { UserTableRow } from "./components/UserTableRow";
import { useUserSelection } from "./hooks/useUserSelection";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { CRMSelectionBar } from "./CRMSelectionBar";
import { CRMUser } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 15;

export function CRMTable() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['crm-users', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('crm_view')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      return {
        users: data as CRMUser[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
      };
    },
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const {
    selectedUsers,
    selectAllPages,
    handleSelectUser,
    handleSelectAll,
    handleSelectAllPages,
    handleDeleteSelected
  } = useUserSelection(users, refetch, data?.totalCount || 0);

  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <CRMSelectionBar
          selectedCount={selectedUsers.length}
          totalCount={data?.totalCount || 0}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDeleteClick={() => setShowDeleteDialog(true)}
          usersInPage={users.length}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <UserTableHeader
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
          />
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={(checked: boolean) => handleSelectUser(user.id, checked)}
                onEdit={() => {}}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        selectAllPages={selectAllPages}
      />
    </div>
  );
}