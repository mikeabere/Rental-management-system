import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Error, 
  Login, 
  Register,
   Landing, 
   HomeLayout, 
   DashboardLayout,
    //Tenants, 
    AddTenant,
    Units, 
    Stats ,
    Profile,
    Reports,
    Messaging,
    Statement,
  } from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
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
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
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
            element: <AddTenant />,
            action: addTenantAction,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "messaging",
            element: <Messaging />,
          },
          {
            path: "statement",
            element: <Statement />,
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
