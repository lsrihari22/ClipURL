import "./index.css";

import AppLayout from "./layouts/app-layout";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import RedirectLink from "./pages/redirect-link";
import LandingPage from "./pages/landing-page";
import Link from "./pages/link";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element:
         <RequireAuth>
            <Dashboard />
          </RequireAuth>
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/link/:id",
        element: <RequireAuth>
            <Link />
          </RequireAuth>
      },
      {
        path: "/:id",
        element: <RedirectLink />
      }
    ]
  }
]);
function App() {
  
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
