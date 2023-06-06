import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";

import ChatSideBar from "./ChatSideBar";
import { useAuth } from "../../hooks/useAuth";
import { useRealtime } from "../../hooks/useRealtime";
import { useNewChat } from "../../hooks/useNewChat";
import { getContactFromUserId } from "../../utils/helpers";

const DRAWER_WIDTH = 350;

export default function ChatLayout() {
  const [open, setOpen] = useState(true);
  const [contacts, setContacts] = useState({ connections: [] });
  const [loading, setLoading] = useState(true);

  const [auth] = useAuth();
  const { message } = useRealtime();
  const { handleConnection } = useNewChat();

  useEffect(() => {
    (async () => {
      if (auth?.user) {
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
      }
    })();
  }, [auth]);

  useEffect(() => {
    if (auth.user && message) handleConnection(message.sent_by, auth.user);
  }, [message, auth, handleConnection]);

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
