import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProductCreate from "@/pages/admin/AdminProductCreate";
import AdminCRM from "@/pages/admin/AdminCRM";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import AdminBulkActions from "@/pages/admin/AdminBulkActions";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="catalog" element={<AdminCatalog />} />
        <Route path="catalog/new" element={<AdminProductCreate />} />
        <Route path="catalog/:id" element={<AdminProductEdit />} />
        <Route path="crm" element={<AdminCRM />} />
        <Route path="bulk-actions" element={<AdminBulkActions />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/:id/manage" element={<AdminProjectManage />} />
      </Route>
    </Routes>
  );
};