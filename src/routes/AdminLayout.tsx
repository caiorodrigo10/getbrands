import { Outlet } from "react-router-dom";
import { AdminNavigationMenu } from "@/components/admin/AdminNavigationMenu";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigationMenu />
      <main className="md:pl-64 w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};