import { Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectManage from "@/pages/admin/AdminProjectManage";
import ProjectProductEdit from "@/pages/admin/ProjectProductEdit";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/catalog" element={<AdminCatalog />} />
      <Route path="/catalog/:id" element={<AdminProductEdit />} />
      <Route path="/projects" element={<AdminProjects />} />
      <Route path="/projects/:id/manage" element={<AdminProjectManage />} />
      <Route path="/projects/:projectId/products/:productId" element={<ProjectProductEdit />} />
    </Routes>
  );
};

export default AdminRoutes;
