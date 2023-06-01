import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { useDialog } from "../../hooks/useDialog";

export const DialogHeader = () => {
  const { closeDialog } = useDialog();

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent="space-between"
        sx={{ m: 2 }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "block",
            fontFamily: "calibri",
            width: "100%",
            textAlign: "center",
          }}
          component="span"
        >
          New message
        </Typography>
        <IconButton onClick={closeDialog}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Divider />
    </>
  );
};

export const DialogBody = () => {
  const { closeDialog } = useDialog();
  const inputEl = useRef();
  const inputStyle = {
    width: "100%",
    marginLeft: "16px",
    border: "none",
    outline: "none",
    display: "block",
    backgroundColor: "transparent",
    color: "rgb(225, 225, 225)",
    fontSize: "16px",
  };

  useEffect(() => {
    if (inputEl) {
      inputEl.current.focus();
    }
  }, []);

  return (
    <>
      <Stack direction={"row"} sx={{ ml: 2, mt: 2 }} alignItems="center">
        <Typography sx={{ fontWeight: "bold" }}>To:</Typography>
        <input placeholder="Search..." ref={inputEl} style={inputStyle} />
      </Stack>
      <br />
      <Box sx={{ height: "300px", overflowY: "scroll" }}>
        <List sx={{ py: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={closeDialog}
              component={Link}
              to={`/chats/1`}
            >
              <ListItemAvatar sx={{ marginRight: -0.5 }}>
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    objectFit: "contain",
                    border: "1px solid #555",
                  }}
                  src={null}
                />
              </ListItemAvatar>
              <ListItemText
                primary={"Some person"}
                sx={{ textTransform: "capitalize" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );
};
