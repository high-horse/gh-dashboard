import MainLayout from "@layouts/MainLayout";
import AdminLayout from "@layouts/AdminLayout";
import Home from "@pages/Home";
import About from "@pages/About";
import AdminDashboard from "@pages/admin/Dashboard";
import { Users } from "@pages/admin/Dashboard";
import LoginPage from "@pages/unauthenticated/Login";
import RegisterPage from "@pages/unauthenticated/Register";
import PublicRoute from "@pages/unauthenticated/PublicRoute";
import Repos from "@pages/github/Repos";
import NotFound from "@pages/NotFound";


const routes = [
  {
    path: "/login",
    name: "Login",
    element: <PublicRoute />,
    children: [{ path: "", element: <LoginPage /> }],
  },
  {
    path: "/register",
    name: "Register",
    element: <PublicRoute />,
    children: [{ path: "", element: <RegisterPage /> }],
  },
  {
    path: "/",
    name: "Main",
    element: <MainLayout />,
    children: [
        { path: "", name: "HomePage", element: <Home /> },
        { path: "repos", name: "ReposPage", element: <Repos /> },
        { path: "about", element: <About /> },
    ],
  },
  {
    path: "/admin",
    name: "AdminLayout",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "users", element: <Users /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
