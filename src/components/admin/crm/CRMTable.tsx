import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTableHeader } from "./components/UserTableHeader";
import { UserTableRow } from "./components/UserTableRow";
import { CRMUser } from "./types";
import { useUserSelection } from "./hooks/useUserSelection";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { SelectionBar } from "./SelectionBar";

export function CRMTable() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: users = [], refetch } = useQuery({
    queryKey: ['crm-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CRMUser[];
    },
  });

  const {
    selectedUsers,
    selectAllPages,
    handleSelectUser,
    handleSelectAll,
    handleSelectAllPages,
    handleDeleteSelected
  } = useUserSelection(users, refetch, users.length);

  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <SelectionBar
          selectedCount={selectedUsers.length}
          totalCount={users.length}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDelete={() => setShowDeleteDialog(true)}
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
                selected={selectedUsers.includes(user.id)}
                onSelect={(checked) => handleSelectUser(user.id, checked)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSelected}
        count={selectedUsers.length}
      />
    </div>
  );
}