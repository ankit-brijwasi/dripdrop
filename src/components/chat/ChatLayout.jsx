import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Query } from "appwrite";

import Box from "@mui/material/Box";

import ChatSideBar from "./ChatSideBar";
import { databases } from "../../appwrite/config";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getProfileFromUserId } from "../../utils/helpers";

const DRAWER_WIDTH = 350;

export default function ChatLayout() {
  const [open, setOpen] = useState(true);
  const [contacts, setContacts] = useState({ connections: [] });
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    (async () => {
      try {
        let docs = await databases.listDocuments(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_CONTACT_COLLECTION_ID,
          [Query.equal("user_id", auth.user.$id)]
        );
        if (docs.total > 0) {
          docs = docs.documents[0];
          setContacts({
            ...docs,
            connections: await Promise.all(
              docs.connections.filter(Boolean).map(async (connection) => {
                const profile = await getProfileFromUserId(connection);
                return profile;
              })
            ),
          });
        }
      } catch (error) {
        toast(error?.response?.message, { type: "error" });
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
