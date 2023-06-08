import { ID } from "appwrite";
import { Fragment, useEffect, useState } from "react";
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
import { processProfileImg } from "../../utils/helpers";

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

export const CommentDialogBody = () => {
  const [comments] = useState([
    {
      $id: "dhaidas",
      comment: "hello there",
      user: {
        name: "Some Person",
      },
      profile: {
        img: null,
      },
      created_on: new Date(),
    },
  ]);

  return (
    <List
      component="ul"
      sx={{ maxHeight: "600px", minHeight: "300px", height: "100%" }}
    >
      {comments.map((c, i) => (
        <Fragment key={i}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt={c.user.name}
                src={c.profile.img}
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
                  {c.user.name}
                </strong>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    color={"rgb(215, 215, 215)"}
                    sx={{ fontSize: "14px" }}
                  >
                    {c.comment}
                  </Typography>
                  <br />
                  <span style={{ fontSize: "10px" }}>
                    {c.created_on.toString()}
                  </span>
                </>
              }
            />
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};

export const CommentDialogActions = () => {
  const [comment, setComment] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("post comment");
  };

  return (
    <Stack direction="row" alignItems="flex-start" sx={{ width: "100%", p: 2 }}>
      <Avatar sx={{ marginRight: "10px" }} />
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
