import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

import { databases } from "../../appwrite/config";
import { useDialog } from "../../hooks/useDialog";
import { getProfileFromUserId, processPostFile } from "../../utils/helpers";
import PostBody from "../profile/Popups";

const Persons = ({ results }) => {
  return results.map((result, i) => (
    <ListItem key={i} disablePadding>
      <Divider orientation="vertical" flexItem />
      <ListItemButton component={Link} to={`/${result.user_id}`}>
        <ListItemAvatar sx={{ marginRight: -0.5 }}>
          <Avatar
            sx={{
              width: 35,
              height: 35,
              objectFit: "contain",
              border: "1px solid #555",
            }}
            src={result.profile_image.href}
          />
        </ListItemAvatar>
        <ListItemText primary={result.username} />
      </ListItemButton>
    </ListItem>
  ));
};

const Posts = ({ results }) => {
  const [openedPost, setOpenedPost] = useState(null);
  const { openDialog, closeDialog } = useDialog();

  const handleClose = useCallback(() => {
    setOpenedPost(null);
    closeDialog();
  }, [closeDialog]);

  useEffect(() => {
    if (openedPost) {
      (async () => {
        let post = await databases.getDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_POST_COLLECTION_ID,
          openedPost.$id
        );
        post.files = post.file_ids.map((file_id) => ({
          id: file_id,
          file: processPostFile(file_id),
        }));
        post.liked_by = post.liked_by.filter(Boolean);
        post.comments = post.comments.filter(Boolean);
        post.userProfile = await getProfileFromUserId(post.user_id);

        openDialog(
          {
            children: <PostBody post={post} />,
            props: { sx: { p: 0 } },
          },
          {
            dialogProps: {
              fullWidth: true,
              maxWidth: "lg",
              onClose: handleClose,
            },
          }
        );
      })();
    }
    return () => setOpenedPost(null);
  }, [openedPost, openDialog, handleClose]);

  return results.map((result, i) => (
    <ListItem key={i} disablePadding>
      <Divider orientation="vertical" flexItem />
      <ListItemButton onClick={async () => setOpenedPost(result)}>
        <ListItemAvatar sx={{ marginRight: -0.5 }}>
          <Avatar
            sx={{
              width: 35,
              height: 35,
              objectFit: "contain",
              border: "1px solid #555",
            }}
            src={result?.previewFile?.href}
          />
        </ListItemAvatar>
        <ListItemText
          primary={result?.caption}
          secondary={result?.profile?.username}
        />
      </ListItemButton>
    </ListItem>
  ));
};

const SearchResults = ({ results, category }) => {
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100%"}
    >
      <Grid item xs={2}>
        <span
          style={{
            paddingRight: "15px",
            paddingLeft: "15px",
            color: "rgb(180, 180, 180)",
            fontFamily: "calibri",
            fontWeight: "bolder",
            fontSize: "14px",
          }}
        >
          {category}
        </span>
      </Grid>
      <Grid item xs={10}>
        <List component="nav" dense>
          {category === "Persons" && <Persons results={results} />}
          {category === "Posts" && <Posts results={results} />}
        </List>
      </Grid>
    </Grid>
  );
};

export default function SearchBox({ open, persons, posts, clearResults }) {
  const paper = {
    height: "auto",
    position: "absolute",
    width: "48.3ch",
    left: "7px",
  };

  return (
    <Grow
      in={open}
      style={{ transformOrigin: "0 0 0" }}
      onExit={(e) => {
        clearResults();
      }}
      mountOnEnter
      unmountOnExit
    >
      <Paper sx={paper}>
        {persons?.length > 0 && (
          <SearchResults results={persons} category={"Persons"} />
        )}
        {persons?.length > 0 && posts?.length > 0 && <Divider />}
        {posts?.length > 0 && (
          <SearchResults results={posts} category={"Posts"} />
        )}
      </Paper>
    </Grow>
  );
}
