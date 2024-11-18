import { Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";

export const AdminRoutes = (
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/catalog" element={<AdminCatalog />} />
    <Route path="/admin/catalog/:id" element={<AdminProductEdit />} />
    <Route path="/admin/projects" element={<AdminProjects />} />
    <Route path="/admin/projects/:id/manage" element={<AdminProjectManage />} />
    <Route path="/admin/projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
  </Routes>
);