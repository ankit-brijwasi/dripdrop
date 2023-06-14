import { forwardRef, useRef, useState } from "react";
import { toast } from "react-toastify";

// material ui modules
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// custom modules
import { useAuth } from "../hooks/useAuth";
import { account, databases } from "../appwrite/config";

// images
import authImg from "../assets/auth.svg";
import basicInfo from "../assets/basic-info.svg";
import { useDialog } from "../hooks/useDialog";
import { isUserNameTaken } from "../utils/helpers";

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

const DialogHeader = ({ title }) => {
  const { closeDialog } = useDialog();

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ py: 2, px: 1 }}
      >
        <Typography variant="h6" width={"100%"} textAlign={"center"}>
          {title}
        </Typography>
        <IconButton onClick={(e) => closeDialog()}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
    </>
  );
};

const DialogUpdateName = forwardRef((props, ref) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        type="text"
        defaultValue={props.oldName}
        variant="standard"
        label="Name"
        InputLabelProps={{ shrink: true }}
        inputRef={ref}
        required
        autoFocus
        fullWidth
      />
    </Box>
  );
});

const DialogUpdateUserName = forwardRef((props, ref) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        type="text"
        defaultValue={props.oldUserName}
        variant="standard"
        label="Username"
        inputRef={ref}
        InputLabelProps={{ shrink: true }}
        required
        autoFocus
        fullWidth
      />
    </Box>
  );
});

const DialogUpdateBio = forwardRef((props, ref) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        type="text"
        defaultValue={props.oldBio}
        variant="standard"
        label="Bio"
        InputLabelProps={{ shrink: true }}
        inputRef={ref}
        rows={4}
        required
        multiline
        autoFocus
        fullWidth
      />
    </Box>
  );
});

const DialogUpdateEmail = forwardRef((props, ref) => {
  const [togglePass, setTogglePass] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        type="email"
        defaultValue={props.oldEmail}
        variant="standard"
        label="Email"
        inputRef={(r) => ref.current.push(r)}
        InputLabelProps={{ shrink: true }}
        required
        autoFocus
        fullWidth
      />
      <br />
      <br />
      <TextField
        type={togglePass ? "text" : "password"}
        variant="standard"
        label="Password"
        inputRef={(r) => ref.current.push(r)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setTogglePass(!togglePass)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ marginRight: -1 }}
              >
                {togglePass ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        fullWidth
      />
    </Box>
  );
});

const DialogUpdatePassword = forwardRef((props, ref) => {
  const [togglePass, setTogglePass] = useState(false);
  const [toggleOldPass, setToggleOldPass] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        type={togglePass ? "text" : "password"}
        variant="standard"
        label="New Password"
        inputRef={(r) => ref.current.push(r)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setTogglePass(!togglePass)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ marginRight: -1 }}
              >
                {togglePass ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        autoFocus
        fullWidth
      />
      <br />
      <br />
      <TextField
        type={toggleOldPass ? "text" : "password"}
        variant="standard"
        label="Old Password"
        inputRef={(r) => ref.current.push(r)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setToggleOldPass(!toggleOldPass)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ marginRight: -1 }}
              >
                {toggleOldPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        fullWidth
      />
    </Box>
  );
});

const DialogAction = ({ onSubmit }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={() => onSubmit()}
    >
      Update
    </Button>
  );
};

const updateProfile = async (data, docId) =>
  await databases.updateDocument(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_PROFILE_COLLECTION_ID,
    docId,
    data
  );

export default function Setting() {
  const [auth, dispatch] = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const nameElRef = useRef(null);
  const userNameElRef = useRef(null);
  const bioElRef = useRef(null);
  const emailElRef = useRef([]);
  const passwordElRef = useRef([]);

  const updateNamePopup = (event) => {
    const handleSubmit = async () => {
      try {
        const data = await account.updateName(nameElRef.current.value);
        toast("Updated your name", { type: "success" });
        dispatch({ type: "update", user: { ...auth.user, ...data } });
        closeDialog();
      } catch (error) {
        if (error?.response?.text) {
          toast(error?.response?.text, { type: "error" });
          return;
        }

        console.log(error);
        toast("Unable to update your name", { type: "error" });
        return;
      }
    };

    openDialog(
      {
        children: <DialogUpdateName oldName={auth.user.name} ref={nameElRef} />,
        props: { sx: { p: 0 } },
      },
      {
        dialogProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
        dialogHeader: {
          children: <DialogHeader title={"Update your name"} />,
          props: { sx: { p: 0 } },
        },
        dialogActions: {
          children: <DialogAction onSubmit={handleSubmit} />,
        },
      }
    );
  };

  const updateUserNamePopup = (event) => {
    const handleSubmit = async () => {
      try {
        if (await isUserNameTaken(userNameElRef.current.value))
          throw Error("Username already taken");

        const data = await updateProfile(
          { username: userNameElRef.current.value },
          auth.user.profile.$id
        );

        dispatch({
          type: "update-profile",
          profile: {
            ...auth.user.profile,
            username: data.username,
          },
        });
        toast("Updated your username", { type: "success" });
        closeDialog();
      } catch (error) {
        if (error?.response?.text) {
          toast(error?.response?.text, { type: "error" });
          return;
        } else if (error?.message) {
          toast(error.message, { type: "error" });
          return;
        }

        console.log(error);
        toast("update username failed! Please try again later", {
          type: "error",
        });
        return;
      }
    };

    openDialog(
      {
        children: (
          <DialogUpdateUserName
            oldUserName={auth.user.profile.username}
            ref={userNameElRef}
          />
        ),
        props: { sx: { p: 0 } },
      },
      {
        dialogProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
        dialogHeader: {
          children: <DialogHeader title={"Update your username"} />,
          props: { sx: { p: 0 } },
        },
        dialogActions: {
          children: <DialogAction onSubmit={handleSubmit} />,
        },
      }
    );
  };

  const updateBioPopup = (event) => {
    const handleSubmit = async () => {
      try {
        const data = await updateProfile(
          { bio: bioElRef.current.value },
          auth.user.profile.$id
        );

        dispatch({
          type: "update-profile",
          profile: { ...auth.user.profile, bio: data.bio },
        });
        toast("Updated your bio", { type: "success" });
        closeDialog();
      } catch (error) {
        if (error?.response?.text) {
          toast(error?.response?.text, { type: "error" });
          return;
        } else if (error?.message) {
          toast(error.message, { type: "error" });
          return;
        }

        console.log(error);
        toast("update bio failed! Please try again later", {
          type: "error",
        });
        return;
      }
    };

    openDialog(
      {
        children: (
          <DialogUpdateBio oldBio={auth.user.profile.bio} ref={bioElRef} />
        ),
        props: { sx: { p: 0 } },
      },
      {
        dialogProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
        dialogHeader: {
          children: <DialogHeader title={"Update your bio"} />,
          props: { sx: { p: 0 } },
        },
        dialogActions: {
          children: <DialogAction onSubmit={handleSubmit} />,
        },
      }
    );
  };

  const updateEmailPopup = (event) => {
    const handleSubmit = async () => {
      try {
        const data = await account.updateEmail(
          emailElRef.current[0].value,
          emailElRef.current[1].value
        );

        dispatch({
          type: "update",
          user: { ...auth.user, ...data },
        });
        toast("Updated your email", { type: "success" });
        closeDialog();
      } catch (error) {
        if (error?.response?.text) {
          toast(error?.response?.text, { type: "error" });
          return;
        } else if (error?.message) {
          toast(error.message, { type: "error" });
          return;
        }

        console.log(error);
        toast("update email failed! Please try again later", {
          type: "error",
        });
        return;
      }
    };

    openDialog(
      {
        children: (
          <DialogUpdateEmail oldEmail={auth.user.email} ref={emailElRef} />
        ),
        props: { sx: { p: 0 } },
      },
      {
        dialogProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
        dialogHeader: {
          children: <DialogHeader title={"Update your Email"} />,
          props: { sx: { p: 0 } },
        },
        dialogActions: {
          children: <DialogAction onSubmit={handleSubmit} />,
        },
      }
    );
  };

  const updatePasswordPopup = (event) => {
    const handleSubmit = async () => {
      try {
        await account.updatePassword(
          passwordElRef.current[0].value,
          passwordElRef.current[1].value
        );

        toast("Password updated", { type: "success" });
        closeDialog();
      } catch (error) {
        if (error?.response?.text) {
          toast(error?.response?.text, { type: "error" });
          return;
        } else if (error?.message) {
          toast(error.message, { type: "error" });
          return;
        }

        console.log(error);
        toast("update password failed! Please try again later", {
          type: "error",
        });
        return;
      }
    };

    openDialog(
      {
        children: <DialogUpdatePassword ref={passwordElRef} />,
        props: { sx: { p: 0 } },
      },
      {
        dialogProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
        dialogHeader: {
          children: <DialogHeader title={"Update your Password"} />,
          props: { sx: { p: 0 } },
        },
        dialogActions: {
          children: <DialogAction onSubmit={handleSubmit} />,
        },
      }
    );
  };

  return (
    <Box
      sx={{
        padding: "0px 30px",
        width: "80%",
        margin: "auto",
      }}
    >
      <br />
      <br />
      <br />
      <br />
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="subtitle1">Basic Info</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Change your basic info
              </Typography>
            </div>
            <img
              src={basicInfo}
              alt="signing in"
              style={{
                width: "150px",
                height: "112px",
                objectFit: "contain",
                marginLeft: "auto",
                display: "block",
              }}
            />
          </Box>
          <List>
            <ListItemButton onClick={updateNamePopup}>
              <ListItemText primary="Name" />
              <ListItemSecondaryAction sx={{ textTransform: "capitalize" }}>
                {auth?.user?.name}
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={updateUserNamePopup}>
              <ListItemText primary="Username" />
              <ListItemSecondaryAction>
                {auth?.user?.profile?.username}
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={updateBioPopup}>
              <ListItemText primary="Bio" />
              <ListItemSecondaryAction>
                <Typography noWrap sx={{ width: "150px", textAlign: "right" }}>
                  {auth?.user?.profile?.bio}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
      <br />
      <br />
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="subtitle1">
                Sign In {"&"} Contact Info
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Change the way on how we can contact you
              </Typography>
            </div>
            <img
              src={authImg}
              alt="signing in"
              style={{
                width: "150px",
                height: "112px",
                objectFit: "contain",
                marginLeft: "auto",
                display: "block",
              }}
            />
          </Box>
          <List>
            <ListItemButton onClick={updateEmailPopup}>
              <ListItemText primary="Email" />
              <ListItemSecondaryAction>
                {auth.user?.email}
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={updatePasswordPopup}>
              <ListItemText primary="Password" />
              <ListItemSecondaryAction>Change</ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
      <br />
      <br />
    </Box>
  );
}
