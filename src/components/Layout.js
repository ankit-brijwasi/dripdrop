// react and react router dom modules
import { Outlet, useNavigate } from "react-router-dom";

// material ui modules
import Box from "@mui/material/Box";

// custom components & modules
import { RealtimeProvider } from "../context/realtimeContext";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

// Layout Component: Defines the structure of the application
function Layout() {
  const navigate = useNavigate();
  const [auth] = useAuth();

  useEffect(() => {
    if (!auth.authenticated) return navigate("/accounts/signin");
  }, [auth.authenticated, navigate]);

  return (
    <RealtimeProvider>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Outlet />
      </Box>
    </RealtimeProvider>
  );
}

export default Layout;
