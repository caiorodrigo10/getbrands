import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminCRM from "@/pages/admin/AdminCRM";
import AdminBulkActions from "@/pages/admin/AdminBulkActions";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProductCreate from "@/pages/admin/AdminProductCreate";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/:id" element={<AdminProjectManage />} />
        <Route path="projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
        <Route path="crm" element={<AdminCRM />} />
        <Route path="bulk-actions" element={<AdminBulkActions />} />
        <Route path="catalog" element={<AdminCatalog />} />
        <Route path="catalog/create" element={<AdminProductCreate />} />
        <Route path="catalog/:id" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
};