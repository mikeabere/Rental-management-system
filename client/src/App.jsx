import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Error, 
  Login, 
  Register,
   Landing, 
   HomeLayout, 
   DashboardLayout,
    Tenants, 
    Units, 
    Stats ,
    AddTenant,
  } from "./pages";

import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as statsLoader } from "./pages/Stats";
import { action as addTenantAction } from "./pages/AddTenant";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            // path: "stats",
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: "units",
            element: <Units />,
            //loader: statsLoader,
          },
          {
            path: "tenants",
            element: <Tenants />,
            //action: addTenantAction,
          },
          {
            path: "addtenant",
            element: <AddTenant />,
            action: addTenantAction,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
  
    <RouterProvider router={router} />
);

}

export default App;
