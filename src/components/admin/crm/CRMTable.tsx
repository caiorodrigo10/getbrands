import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { UserProfileEditModal } from "./UserProfileEditModal";
import { CRMSelectionBar } from "./CRMSelectionBar";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { UserTableHeader } from "./components/UserTableHeader";
import { UserTableRow } from "./components/UserTableRow";
import { useUserSelection } from "./hooks/useUserSelection";
import { CRMUser } from "./types";

interface CRMTableProps {
  users: CRMUser[];
  onUserUpdated: () => void;
  totalUsers: number;
}

export const CRMTable = ({ users, onUserUpdated, totalUsers }: CRMTableProps) => {
  const [selectedUser, setSelectedUser] = useState<CRMUser | null>(null);
  
  const {
    selectedUsers,
    selectAllPages,
    showDeleteDialog,
    setShowDeleteDialog,
    handleSelectUser,
    handleSelectAll,
    handleSelectAllPages,
    handleDeleteSelected
  } = useUserSelection(users, onUserUpdated, totalUsers);

  return (
    <>
      {selectedUsers.length > 0 && (
        <CRMSelectionBar
          selectedCount={selectAllPages ? totalUsers : selectedUsers.length}
          totalCount={totalUsers}
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
            allSelected={selectedUsers.length === users.length || selectAllPages}
          />
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id) || selectAllPages}
                onSelect={handleSelectUser}
                onEdit={setSelectedUser}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserProfileEditModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onUserUpdated={onUserUpdated}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        selectAllPages={selectAllPages}
      />
    </>
  );
};