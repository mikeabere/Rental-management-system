import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Error, Login, Register, Landing, HomeLayout } from "./pages";

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
    ],
},

]);

function App() {
  return (
  
    <RouterProvider router={router} />
);

}

export default App;
