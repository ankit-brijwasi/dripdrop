import { ID, Query } from "appwrite";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// material ui icons
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

import { useDialog } from "../../hooks/useDialog";
import { useAuth } from "../../hooks/useAuth";

import { databases, storage } from "../../appwrite/config";
import { processProfileImg, getProfileFromUserId } from "../../utils/helpers";
import useComment from "../../hooks/useComment";
import { formatTimeAgo } from "../../utils/helpers";
import Loading from "../Loading";

export const DialogHeader = () => {
  return (
    <Typography variant="h4" component={"span"} fontFamily="calibri">
      Change your profile picture
    </Typography>
  );
};

export const DialogBody = () => {
  return (
    <Typography variant="body1" fontFamily="calibri">
      Update your profile picture with the new image selected?
    </Typography>
  );
};

export const DialogActions = ({ file, handleClose }) => {
  const [auth, dispatch] = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async (file) => {
    setSaving(true);
    let storageObj = await storage.createFile(
      process.env.REACT_APP_PROFILE_IMAGE_BUCKET,
      ID.unique(),
      file
    );

    let updated_data = await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_PROFILE_COLLECTION_ID,
      auth?.user.profile.$id,
      {
        profile_image: storageObj.$id,
      }
    );

    handleClose();
    toast("Profile picture updated", { type: "info" });
    setSaving(false);
    dispatch({
      type: "update",
      user: {
        ...auth.user,
        profile: {
          ...updated_data,
          profile_image: processProfileImg(updated_data.profile_image),
        },
      },
    });
  };

  useEffect(() => {
    return () => setSaving(false);
  }, []);

  return (
    <>
      <Button
        onClick={handleClose}
        size="small"
        color="inherit"
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleSave(file)}
        disabled={saving}
        size="small"
        variant="contained"
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </>
  );
};

export const CommentDialogHeader = () => {
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
          variant="h5"
          sx={{
            display: "block",
            fontFamily: "calibri",
            width: "100%",
            textAlign: "center",
          }}
          component="span"
        >
          Comments
        </Typography>
        <IconButton onClick={closeDialog}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Divider />
    </>
  );
};

export const CommentDialogBody = ({ post }) => {
  const elRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const { comment, addComment } = useComment();

  useEffect(() => {
    (async () => {
      // TODO: update the post here
      if (comment?.post_id === post.$id) {
        comment.profile = await getProfileFromUserId(comment.user_id);
        setComments((prevComments) => [...prevComments, comment]);
      }
      elRef.current.scrollTo({
        top: elRef.current.scrollHeight,
        behavior: "smooth",
      });
    })();

    return () => addComment(null);
  }, [comment, post, addComment]);

  useEffect(() => {
    (async () => {
      try {
        const doc = await databases.listDocuments(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_COMMENT_COLLECTION_ID,
          [Query.equal("post_id", post.$id)]
        );
        if (doc.total > 0) {
          setComments(
            await Promise.all(
              doc.documents.map(async (document) => ({
                ...document,
                profile: await getProfileFromUserId(document.user_id),
              }))
            )
          );
        }
      } catch (error) {
        if (error?.response?.text)
          toast(error?.response?.text, { type: "error" });
        else {
          console.log(error);
          toast("Something went wrong", { type: "error" });
        }
      }
    })();
    setLoading(false);
  }, [comments, post]);

  return (
    <List
      component="ul"
      sx={{
        maxHeight: "600px",
        minHeight: "300px",
        height: "100%",
        overflowY: "auto",
      }}
      ref={elRef}
    >
      {loading ? (
        <Loading style={{ minHeight: "inherit" }} />
      ) : (
        comments.map((c, i) => (
          <Fragment key={i}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={c?.profile.username}
                  src={c?.profile.profile_image.href}
                  style={{ backgroundColor: "#d2d2d2" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <strong
                    style={{
                      color: "rgb(225, 225, 225)",
                      textTransform: "capitalize",
                      fontSize: "13px",
                    }}
                  >
                    {c?.profile.username}
                  </strong>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      color={"rgb(215, 215, 215)"}
                      sx={{ fontSize: "14px" }}
                    >
                      {c?.message}
                    </Typography>
                    <br />
                    <span style={{ fontSize: "10px" }}>
                      {formatTimeAgo(new Date(c?.posted_on))}
                    </span>
                  </>
                }
              />
            </ListItem>
          </Fragment>
        ))
      )}
    </List>
  );
};

export const CommentDialogActions = ({ post, onCommentSuccess }) => {
  const [comment, setComment] = useState("");
  const [auth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doc = await databases.createDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_COMMENT_COLLECTION_ID,
        ID.unique(),
        {
          message: comment,
          post_id: post.$id,
          user_id: auth.user.$id,
          posted_on: new Date().toISOString().replace("Z", "+00:00"),
        }
      );
      await databases.updateDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_POST_COLLECTION_ID,
        post.$id,
        {
          comments: [...post.comments, doc.$id],
        }
      );
      onCommentSuccess(post.$id, doc);
    } catch (error) {
      if (error?.response?.text)
        toast(error?.response?.text, { type: "error" });
      else {
        console.log(error);
        toast("Something went wrong", { type: "error" });
      }
    }
    setComment("");
  };

  return (
    <Stack direction="row" alignItems="flex-start" sx={{ width: "100%", p: 2 }}>
      <Avatar
        sx={{ marginRight: "10px" }}
        src={auth.user.profile.profile_image.href}
      />
      <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
        <TextField
          variant="outlined"
          color="primary"
          sx={{ width: "100%" }}
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Fab
                  type="submit"
                  color="primary"
                  aria-label="send message"
                  disabled={comment.length === 0}
                  size="small"
                >
                  <SendIcon fontSize="small" />
                </Fab>
              </InputAdornment>
            ),
          }}
          multiline
          fullWidth
        />
      </form>
    </Stack>
  );
};
