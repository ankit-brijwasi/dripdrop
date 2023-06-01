import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import ChatSideBar from "./ChatSideBar";

const DRAWER_WIDTH = 350;
const demoContacts = [
  {
    $id: "1",
    name: "Will Smith",
    image:
      "https://images.pexels.com/photos/12023151/pexels-photo-12023151.jpeg?auto=compress&cs=tinysrgb&w=260&h=260&dpr=1",
  },
  {
    $id: "2",
    name: "Jane Doe",
    image:
      "https://images.pexels.com/photos/16904525/pexels-photo-16904525/free-photo-of-woman-sitting-in-river.jpeg?auto=compress&cs=tinysrgb&w=260&h=260&dpr=1",
  },
  {
    $id: "3",
    name: "Settings",
    image:
      "https://images.pexels.com/photos/15679734/pexels-photo-15679734/free-photo-of-young-woman-lying-on-floor-in-studio-posing.jpeg?auto=compress&cs=tinysrgb&w=260&h=260&dpr=1",
  },
];

export default function ChatLayout(props) {
  const [open, setOpen] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tId = setTimeout(() => {
      // simulate loading
      setContacts(demoContacts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(tId);
  }, []);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <ChatSideBar
        drawerWidth={DRAWER_WIDTH}
        open={open}
        setOpen={() => setOpen(!open)}
        contacts={contacts}
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
