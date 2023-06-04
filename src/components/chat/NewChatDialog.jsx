import { Query } from "appwrite";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
import Loading from "../Loading";
import { databases } from "../../appwrite/config";
import { processProfileImg } from "../../utils/helpers";
import { useNewChat } from "../../hooks/useNewChat";


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
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const inputEl = useRef();

  const { handleConnection } = useNewChat();

  const { closeDialog } = useDialog();

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
    if (inputEl) inputEl.current.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (search.length > 0) {
        setSearching(true);
        try {
          const profiles = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_PROFILE_COLLECTION_ID,
            [Query.search("username", search)]
          );

          setUsers(
            profiles.documents.map((profile) => ({
              ...profile,
              profile_image: processProfileImg(profile.profile_image),
            }))
          );
        } catch (error) {
          toast(error.response.message, { type: "error" });
        }
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleClick = async (user) => {
    closeDialog();
    handleConnection({
      username: user.username,
      profile_image: user.profile_image,
    });
  };

  return (
    <>
      <Stack direction={"row"} sx={{ ml: 2, mt: 2 }} alignItems="center">
        <Typography sx={{ fontWeight: "bold" }}>To:</Typography>
        <input
          type="search"
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          ref={inputEl}
          style={inputStyle}
        />
      </Stack>
      <br />
      <Box sx={{ height: "300px", overflowY: "scroll" }}>
        <List sx={{ py: 0 }}>
          {searching ? (
            <Loading style={{ minHeight: "30vh" }} message={"searching..."} />
          ) : (
            users.map((user, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton
                  onClick={event => handleClick(user)}
                  component={Link}
                  to={`/chats/${user.username}`}
                >
                  <ListItemAvatar sx={{ marginRight: -0.5 }}>
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        objectFit: "contain",
                        border: "1px solid #555",
                      }}
                      src={user.profile_image.href}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </>
  );
};
