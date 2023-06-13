// react, react router dom and others
import { ID, Query } from "appwrite";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// material ui modules
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

// material ui styles api
import { styled, alpha } from "@mui/material/styles";

// material ui icons
import SearchIcon from "@mui/icons-material/Search";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ChatIcon from "@mui/icons-material/Chat";

// custom modules
import { account, databases, functions, storage } from "../appwrite/config";
import { useDialog } from "../hooks/useDialog";
import { useAuth } from "../hooks/useAuth";
import Carousel from "./Carousel";
import SearchBox from "./navbar/SearchBox";
import NotificationBox from "./navbar/NotificationBox";
import {
  getPostFilePreview,
  getProfileFromUserId,
  processProfile,
  searchAndArrangeArray,
} from "../utils/helpers";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "41.7ch",
      },
    },
  },
}));

const DialogHeader = () => {
  return (
    <Typography variant="h6" component={"span"} fontFamily="calibri">
      Post new update
    </Typography>
  );
};

const DialogBody = ({ elRef, files }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (files.length > 0) {
      const temp = Array.from(files).map((file, index) => (
        <div key={index} data-value={index + 1}>
          <img
            src={URL.createObjectURL(file)}
            style={{
              objectFit: "contain",
              width: "600px",
              userSelect: "none",
              pointerEvents: "none",
            }}
            alt={`pic-${index}`}
          />
        </div>
      ));
      setItems(temp);
    }
  }, [files]);

  return items.length > 0 ? (
    <Box sx={{ width: "600px", height: "100%", position: "relative" }}>
      <TextField
        type="text"
        placeholder="Provide a caption for your post"
        sx={{ marginBottom: 1.6 }}
        inputProps={{ ref: elRef }}
        fullWidth
        multiline
        autoFocus
      />
      <Carousel items={items} />
    </Box>
  ) : (
    <i>Rendering images...</i>
  );
};

const DialogActions = ({ files, getCaption, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auth] = useAuth();

  const handleClick = async (event) => {
    setLoading(true);
    try {
      let file_ids = [];
      for (let i = 0; i < files.length; i++) {
        // upload file to bucket
        let file = await storage.createFile(
          process.env.REACT_APP_USER_DATA_BUCKET,
          ID.unique(),
          files[i]
        );
        file_ids.push(file.$id);
      }

      let postData = {
        user_id: auth?.user.$id,
        posted_on: new Date().toISOString().replace("Z", "+00:00"),
        file_ids,
      };

      if (getCaption()) postData.caption = getCaption();
      const post = await databases.createDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_POST_COLLECTION_ID,
        ID.unique(),
        postData
      );
      handleClose();
      toast("Posted new update in your timeline!", { type: "info" });

      await functions.createExecution(
        process.env.REACT_APP_GENERATE_NOTIFICATION_FUNC,
        JSON.stringify({
          action: "post-added",
          post_id: post.$id,
        })
      );
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (error) {
      toast(error.response.message, { type: "error" });
    }
  }, [error]);

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
        onClick={handleClick}
        disabled={loading}
        size="small"
        variant="contained"
      >
        {loading ? "Posting..." : "Post"}
      </Button>
    </>
  );
};

// NavBar Component: Navbar for the application
export default function NavBar(props) {
  const [openSearch, setOpenSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [persons, setPersons] = useState([]);
  const [posts, setPosts] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [files, setFiles] = useState([]);

  const auth = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const inputEl = useRef();
  const captionEl = useRef();

  useEffect(() => {
    let timeoutId;
    const search = async () => {
      let resultsFound = false;

      const profileDocs = await databases.listDocuments(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_PROFILE_COLLECTION_ID,
        [Query.search("username", keyword)]
      );

      const postDocs = await databases.listDocuments(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_POST_COLLECTION_ID,
        [Query.search("caption", keyword)]
      );

      if (profileDocs.total > 0) {
        profileDocs.documents = profileDocs.documents.map((doc) =>
          processProfile(doc)
        );
        profileDocs.documents = searchAndArrangeArray(
          profileDocs.documents,
          keyword,
          "username"
        );
        setPersons(profileDocs.documents.splice(0, 6));
        resultsFound = true;
      }

      if (postDocs.total > 0) {
        postDocs.documents = postDocs.documents.map((doc) => {
          let previewFile;
          if (doc.file_ids.length > 0)
            previewFile = getPostFilePreview(doc.file_ids[0], 40, 40);
          else previewFile = null;
          return {
            ...doc,
            profile: getProfileFromUserId(doc.user_id),
            previewFile,
          };
        });
        postDocs.documents = searchAndArrangeArray(
          postDocs.documents,
          keyword,
          "caption"
        );
        setPosts(postDocs.documents.splice(0, 6));
        resultsFound = true;
      }

      if (resultsFound) setOpenSearch(true);
    };

    if (keyword.length > 0) {
      timeoutId = setTimeout(search, 500);
    } else {
      setOpenSearch(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [keyword]);

  const handleAddPost = () => {
    if (inputEl) inputEl.current.click();
  };

  const handleClose = () => {
    closeDialog();
    setFiles([]);
    if (inputEl) inputEl.current.value = "";
  };

  const handleLogout = async (event) => {
    auth[1]({ type: "signout" });
    try {
      await account.deleteSession("current");
    } catch (error) {
      if (error?.response?.text)
        toast(error?.response?.text, { type: "error" });
      else {
        console.log(error);
        toast("some error occured", { type: "error" });
      }
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      openDialog(
        {
          children: <DialogBody elRef={captionEl} files={files} />,
        },
        {
          dialogProps: { maxWidth: "md", onClose: handleClose },
          dialogHeader: { children: <DialogHeader /> },
          dialogActions: {
            children: (
              <DialogActions
                getCaption={() => captionEl.current?.value}
                files={files}
                handleClose={handleClose}
              />
            ),
          },
        }
      );
    }
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AppBar
        color="default"
        position="fixed"
        sx={{
          borderLeft: "none",
        }}
      >
        <Toolbar
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignContent: "flex-end",
            [theme.breakpoints.down("sm")]: {
              width: "100%",
            },
          })}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: "auto",
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <LanguageIcon sx={{ mr: 1.5, mt: 0.5 }} />
              DripDrop
            </Typography>
          </div>
          <ClickAwayListener onClickAway={() => setOpenSearch(false)}>
            <Box
              sx={{
                marginRight: "auto",
                marginLeft: "10px",
                position: "relative",
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </Search>
              <SearchBox
                open={openSearch}
                persons={persons}
                posts={posts}
                clearResults={() => {
                  setPersons([]);
                  setPosts([]);
                }}
              />
            </Box>
          </ClickAwayListener>
          <input
            style={{ display: "none" }}
            ref={inputEl}
            type="file"
            onChange={(event) => setFiles(event.target.files)}
            accept="image/*"
            multiple
          />
          <Tooltip title="Add new post">
            <IconButton
              color="inherit"
              onClick={() => handleAddPost()}
              sx={{ marginRight: 1 }}
            >
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Messages">
            <IconButton
              color="inherit"
              component={Link}
              to="/chats"
              sx={{ marginRight: 1 }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <ClickAwayListener
            onClickAway={() => {
              setOpenNotification(false);
            }}
          >
            <div>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={() => setOpenNotification(!openNotification)}
                  sx={{ marginRight: 1 }}
                >
                  <NotificationsNoneIcon />
                </IconButton>
              </Tooltip>
              {openNotification && <NotificationBox open={openNotification} />}
            </div>
          </ClickAwayListener>
          <Tooltip title="Log out">
            <IconButton
              onClick={handleLogout}
              color="inherit"
              sx={{ marginRight: 1 }}
            >
              <PowerSettingsNewIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </>
  );
}
