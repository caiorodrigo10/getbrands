import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";

export const AdminRoutes = [
  <Route key="admin" path="/admin" element={<AdminDashboard />} />,
  <Route key="admin-catalog" path="/admin/catalog" element={<AdminCatalog />} />,
  <Route key="admin-catalog-edit" path="/admin/catalog/:id" element={<AdminProductEdit />} />,
  <Route key="admin-projects" path="/admin/projects" element={<AdminProjects />} />,
  <Route key="admin-project-manage" path="/admin/projects/:id/manage" element={<AdminProjectManage />} />,
  <Route key="admin-project-product-edit" path="/admin/projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
];