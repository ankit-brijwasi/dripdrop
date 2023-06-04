// react and react router dom
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// material ui hooks
import { useTheme, alpha } from "@mui/material/styles";

// material ui modules
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

// material icons
import EditNoteIcon from "@mui/icons-material/EditNote";

// custom
import { useDialog } from "../../hooks/useDialog";
import { useNewChat } from "../../hooks/useNewChat";
import { DialogBody, DialogHeader } from "./NewChatDialog";
import Empty from "../Empty";


const Contact = (props) => {
  const theme = useTheme();
  const [contacts, setContacts] = useState(props.contacts);
  const { pathname } = useLocation();
  const { connection } = useNewChat();

  const color = alpha(theme.palette.common.white, 0.15);
  const basePath = "/chats/";

  useEffect(() => {
    if (connection) {
      setContacts((prevState) => [connection, ...prevState]);
    }
  }, [connection]);

  return (
    <List dense={true}>
      {contacts.length === 0 && <Empty style={{ minHeight: "90vh" }} />}
      {contacts.map((connection, i) => {
        return (
          <ListItemButton
            key={i}
            sx={{ mb: 0.6, py: 1 }}
            component={Link}
            to={`${basePath}${connection.username}`}
            style={
              pathname === `${basePath}${connection.username}`
                ? { backgroundColor: color }
                : {}
            }
          >
            <ListItemIcon>
              <Avatar src={connection.profile_image?.href} />
            </ListItemIcon>
            <ListItemText primary={connection.username} />
          </ListItemButton>
        );
      })}
    </List>
  );
};


export default function ChatSideBar({
  drawerWidth,
  open,
  setOpen,
  contacts,
  loading,
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const { openDialog } = useDialog();

  const handleClick = (event) => {
    openDialog(
      { children: <DialogBody />, props: { sx: { m: 0, p: 0 } } },
      {
        dialogProps: {
          PaperProps: { sx: { minWidth: "500px", borderRadius: "10px" } },
        },
        dialogHeader: {
          props: { sx: { padding: 0 } },
          children: <DialogHeader />,
        },
      }
    );
  };

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          zIndex: theme.zIndex.appBar - 1,
        }}
      >
        <Drawer
          variant={matches ? "permanent" : "temporary"}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              pt: matches ? "70px" : "0",
            },
            position: "relative",
          }}
          open={matches ? open : !open}
          onClose={() => setOpen(!open)}
        >
          {loading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Loading...
            </div>
          ) : (
            <Contact contacts={contacts} />
          )}
          <Fab
            color="primary"
            sx={{ position: "absolute", bottom: 50, right: 20 }}
            onClick={handleClick}
          >
            <EditNoteIcon />
          </Fab>
        </Drawer>
      </Box>
    </>
  );
}
