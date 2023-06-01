import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import useTheme from "@mui/material/styles/useTheme";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";

import Post from "../components/Post";
import SuggestedAccount from "../components/home/SuggestedAccount";
import * as popups from "../components/home/Popups";

const profilePic =
  "https://images.pexels.com/photos/16564742/pexels-photo-16564742/free-photo-of-fashion-man-people-woman.jpeg?auto=compress&cs=tinysrgb&w=255&h=255&dpr=1";

const suggestedAccounts = [
  {
    id: 1,
    name: "Navdeep Mishra",
    profile_img: "https://picsum.photos/id/35/200/300",
  },
  {
    id: 2,
    name: "Rajesh Joshi",
    profile_img: "https://picsum.photos/id/32/200/300",
  },
  {
    id: 3,
    name: "Harshita Arya",
    profile_img: "https://picsum.photos/id/33/200/300",
  },
  {
    id: 4,
    name: "Amiya Patanaik",
    profile_img: "https://picsum.photos/id/34/200/300",
  },
  {
    id: 5,
    name: "Kishan",
    profile_img: "https://picsum.photos/id/36/200/300",
  },
];

// TODO: Wrap home in AuthHOC
export default function Home() {
  const theme = useTheme();
  const [auth] = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const inputEl = useRef(null);
  const [file, setFile] = useState(null);

  const changeProfilePicDialog = (event) => {
    event.preventDefault();
    if (inputEl) inputEl.current.click();
  };

  const handleClose = (event) => {
    closeDialog();
    setFile(null);
    if (inputEl) inputEl.current.value = "";
  };

  useEffect(() => {
    if (file) {
      openDialog(
        { children: <popups.DialogBody /> },
        {
          dialogProps: { maxWidth: "md", onClose: handleClose },
          dialogHeader: { children: <popups.DialogHeader /> },
          dialogActions: {
            children: (
              <popups.DialogActions file={file} handleClose={handleClose} />
            ),
          },
        }
      );
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenComments = (event) => {
    const dialogBody = {
      children: <popups.CommentDialogBody />,
      props: { sx: { m: 0, p: 0 } },
    };

    openDialog(dialogBody, {
      dialogProps: {
        PaperProps: { sx: { minWidth: "600px", borderRadius: "10px" } },
      },
      dialogHeader: {
        children: <popups.CommentDialogHeader />,
        props: { sx: { padding: 0 } },
      },
      dialogActions: {
        props: { sx: { padding: 0 } },
        children: (
          <popups.CommentDialogActions file={file} handleClose={handleClose} />
        ),
      },
    });
  };

  return (
    <Box sx={{ mt: 10, mx: 8, width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {[1, 2, 3].map((post) => (
            <Post
              key={post}
              style={{
                [theme.breakpoints.up("sm")]: {
                  marginRight: 10,
                  marginLeft: "auto",
                },
              }}
              openComments={handleOpenComments}
            />
          ))}
        </Grid>
        <Grid item xs={12} sm={4} sx={{ position: "fixed", right: 0, width: "100%" }}>
          <Box sx={{ width: "70%", marginRight: "auto" }}>
            <List>
              <ListItem
                secondaryAction={
                  <>
                    <input
                      style={{ display: "none" }}
                      ref={inputEl}
                      type="file"
                      onChange={(event) => setFile(event.target.files[0])}
                      accept="image/*"
                    />
                    <Tooltip title="Update profile picture">
                      <IconButton
                        onClick={changeProfilePicDialog}
                        variant="contained"
                        sx={{ marginTop: 1 }}
                      >
                        <PhotoCameraIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
                disablePadding
              >
                <ListItemButton component={Link} to="/accounts/me">
                  <ListItemAvatar sx={{ marginRight: 2 }}>
                    <Avatar
                      alt={auth?.user?.name}
                      sx={{
                        width: 55,
                        height: 55,
                        objectFit: "contain",
                        border: "1px solid #555",
                      }}
                      src={profilePic}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<b>{auth?.user?.name}</b>}
                    sx={{ textTransform: "capitalize" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ mx: 10 }} />
            <Typography
              marginTop={2}
              variant="body2"
              fontWeight={"bold"}
              color={"rgb(180, 180, 180)"}
              sx={{ mx: 2 }}
              gutterBottom
            >
              Suggested accounts
            </Typography>

            {suggestedAccounts.map((user, i) => (
              <SuggestedAccount
                key={i}
                id={user.id}
                name={user.name}
                profile_image={user.profile_img}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
