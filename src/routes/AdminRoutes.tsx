import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProductCreate from "@/pages/admin/AdminProductCreate";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCRM from "@/pages/admin/AdminCRM";

export const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/catalog" element={<AdminCatalog />} />
      <Route path="/catalog/new" element={<AdminProductCreate />} />
      <Route path="/catalog/:id" element={<AdminProductEdit />} />
      <Route path="/projects" element={<AdminProjects />} />
      <Route path="/projects/:id/manage" element={<AdminProjectManage />} />
      <Route path="/projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/crm" element={<AdminCRM />} />
    </Routes>
  </AdminLayout>
);