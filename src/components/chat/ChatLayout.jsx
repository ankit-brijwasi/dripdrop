import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import ChatSideBar from "./ChatSideBar";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getContactFromUserId } from "../../utils/helpers";

const DRAWER_WIDTH = 350;

export default function ChatLayout() {
  const [open, setOpen] = useState(true);
  const [contacts, setContacts] = useState({ connections: [] });
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const contact = await getContactFromUserId(auth.user.$id, true);
        if (contact) setContacts(contact);
      } catch (error) {
        let message = error?.response
          ? error?.response?.message
          : "Some error occured";

        toast(message, { type: "error" });
        if (message === "Some error occured") console.log(error);
      }

      setLoading(false);
    })();
  }, [auth.user.$id]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <ChatSideBar
        drawerWidth={DRAWER_WIDTH}
        open={open}
        setOpen={() => setOpen(!open)}
        contacts={contacts.connections}
        loading={loading}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginRight: "auto",
        }}
      >
        <br />
        <br />
        <Outlet />
      </Box>
    </Box>
  );
}
