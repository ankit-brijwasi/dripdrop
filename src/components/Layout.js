// react and react router dom modules
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// material ui modules
import Box from "@mui/material/Box";

// custom components & modules
import { RealtimeProvider } from "../context/realtimeContext";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";

// Layout Component: Defines the structure of the application
function Layout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [auth] = useAuth();

  if (!auth.authenticated) return navigate("/accounts/signin");
  
  return (
    <RealtimeProvider>
      <Box sx={{ display: "flex" }}>
        <Navbar handleDrawerToggle={() => setOpen(!open)} />
        <Outlet />
      </Box>
    </RealtimeProvider>
  );
}

export default Layout;
