import MainLayout from "@layouts/MainLayout";
import AdminLayout from "@layouts/AdminLayout";
import Home from "@pages/Home";
import About from "@pages/About";
import AdminDashboard from "@pages/admin/Dashboard";
import { Users } from "@pages/admin/Dashboard";
import LoginPage from "@pages/unauthenticated/Login";
import PublicRoute from "@pages/unauthenticated/PublicRoute";

const routes = [
    {
        path: "/login", 
        name: "Login",
        element: <PublicRoute />,
        children:[
            { path: "", element: <LoginPage /> }
        ]
    },
    {
        path: "/",
        name: "Main",
        element: <MainLayout />,
        children: [
            { path: "", name: "", element: <Home /> },
            { path: "about", element: <About /> }
        ],

    },
    {
        path: "/admin",
        name: "AdminLayout",
        element: <AdminLayout />,
        children: [
            { path: "", element: <AdminDashboard /> },
            { path: "users", element: <Users /> }
        ],
    }
];

export default  routes;