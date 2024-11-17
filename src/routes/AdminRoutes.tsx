import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminCRM from "@/pages/admin/AdminCRM";

export const AdminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-projects"
    path="/admin/projects"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProjects />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-project-manage"
    path="/admin/projects/:id/manage"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProjectManage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-orders"
    path="/admin/orders"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminOrders />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-catalog"
    path="/admin/catalog"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminCatalog />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-catalog-edit"
    path="/admin/catalog/:id"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProductEdit />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-crm"
    path="/admin/crm"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminCRM />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
];