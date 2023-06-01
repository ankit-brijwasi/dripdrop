// react and react router dom modules
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// material ui modules
import Box from "@mui/material/Box";

// custom components & modules
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";

// Layout Component: Defines the structure of the application
function Layout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    if (!auth?.user) navigate("/accounts/signin");
  }, [auth, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar handleDrawerToggle={() => setOpen(!open)} />
      <Outlet />
    </Box>
  );
}

export default Layout;
