
import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductCreate from "@/pages/admin/AdminProductCreate";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminCRM from "@/pages/admin/AdminCRM";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";
import AdminBulkActions from "@/pages/admin/AdminBulkActions";
import AdminCoupons from "@/pages/admin/AdminCoupons";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="catalog" element={<AdminCatalog />} />
        <Route path="catalog/new" element={<AdminProductCreate />} />
        <Route path="catalog/:id" element={<AdminProductEdit />} />
        <Route path="crm" element={<AdminCRM />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/:id" element={<AdminProjectManage />} />
        <Route path="projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
        <Route path="bulk-actions" element={<AdminBulkActions />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
