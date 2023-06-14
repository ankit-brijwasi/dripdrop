// react modules
import { useEffect, useRef, useState, forwardRef } from "react";

// material ui components
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// material ui icons
import AudioFileIcon from "@mui/icons-material/AudioFile";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import VideoFileIcon from "@mui/icons-material/VideoFile";

// material ui hooks
import { useTheme } from "@mui/material/styles";
import { useDialog } from "../../hooks/useDialog";
import { storage } from "../../appwrite/config";
import { ID } from "appwrite";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

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

const Image = ({ image }) => {
  return (
    <>
      <CardMedia
        component="img"
        height="300px"
        image={URL.createObjectURL(image)}
        alt="post caption"
        sx={{
          objectFit: "contain",
          marginBottom: 0.6,
          backgroundColor: "#000",
        }}
      />
    </>
  );
};

const Audio = ({ audio }) => {
  return (
    <>
      <audio
        controls
        style={{ objectFit: "contain", marginBottom: 0.6, width: "100%" }}
      >
        <source src={URL.createObjectURL(audio)} />
      </audio>
      <br />
    </>
  );
};

const Video = ({ video }) => {
  return (
    <>
      <video
        controls
        style={{ objectFit: "contain", marginBottom: 0.6, width: "100%" }}
      >
        <source src={URL.createObjectURL(video)} />
      </video>
      <br />
    </>
  );
};

const PreviewAttachment = (props) => {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const formEl = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const uploaded_file = await storage.createFile(
        process.env.REACT_APP_CHAT_DATA_BUCKET,
        ID.unique(),
        props.attachment,
        undefined,
        (file) => setUploadProgress(file.progress)
      );
      setUploading(false);
      props.onSend(caption, [uploaded_file.$id]);
    } catch (error) {
      if (error?.response?.text) {
        toast(error?.response?.text, { type: "error" });
      } else if (error?.message) {
        toast(error.message, { type: "error" });
      } else {
        console.log(error);
        toast("attachment upload failed! Please try again later", {
          type: "error",
        });
      }
    }
  };

  document.onkeydown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) handleSubmit(event);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} ref={formEl} sx={{ p: 2 }}>
      <div style={{ position: "relative" }}>
        {props.type === "image" && <Image image={props.attachment} />}
        {props.type === "audio" && <Audio audio={props.attachment} />}
        {props.type === "video" && <Video video={props.attachment} />}
        {uploading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, .8)",
              position: "absolute",
              top: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress variant="determinate" value={uploadProgress} />
            </div>
          </div>
        )}
      </div>
      <br />
      <TextField
        type="text"
        variant="standard"
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Fab
                type="submit"
                color="primary"
                aria-label="send message"
                sx={{ width: "35px", height: "35px" }}
                disabled={uploading}
              >
                <SendIcon sx={{ fontSize: "18px" }} />
              </Fab>
            </InputAdornment>
          ),
        }}
        rows={2}
        multiline
        autoFocus
        fullWidth
      />
    </Box>
  );
};

// SendMsg: Text Box component where the user can type message and send it
function SendMsg({ sendMsg }) {
  const [msg, setMsg] = useState("");
  const inputEl = useRef([]);
  const theme = useTheme();

  const [imgAttachment, setImgAttachment] = useState(null);
  const [audAttachment, setAudAttachment] = useState(null);
  const [vidAttachment, setVidAttachment] = useState(null);

  const { openDialog, closeDialog } = useDialog();

  document.onkeydown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) handleSubmit();
  };

  const iconStyle = { fontSize: "23px", cursor: "pointer" };
  const inputStyle = { display: "none" };

  const classes = {
    msgBox: {
      position: "fixed",
      bottom: 4,
      paddingLeft: "10px",
      paddingRight: "10px",
      width: "calc(100% - 350px)",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    flex: {
      display: "flex",
    },
    input: {
      width: "100%",
      zIndex: "1",
    },
  };

  const handleSubmit = () => {
    if (msg.length === 0) return;
    sendMsg(msg);
    setMsg("");
  };

  const handleAttachment = (attachmentType) => {
    if (attachmentType === "image") inputEl.current[0].click();
    else if (attachmentType === "audio") inputEl.current[1].click();
    else if (attachmentType === "video") inputEl.current[2].click();
  };

  const handleDialogClose = () => {
    closeDialog();
    for (let i = 0; i <= 2; i++) {
      inputEl.current[i].value = "";
    }
    setImgAttachment(null);
    setAudAttachment(null);
    setVidAttachment(null);
  };

  const handleAttachmentChange = (event) => {
    if (event.target?.files && event.target?.files?.length > 0) {
      if (event.target.name === "image") {
        setImgAttachment(event.target.files[0]);
      } else if (event.target.name === "audio") {
        setAudAttachment(event.target.files[0]);
      }
      if (event.target.name === "video") {
        setVidAttachment(event.target.files[0]);
      }
    }
  };

  const handleSend = (msg, file) => {
    console.log(file)
    sendMsg(msg, file)
    handleDialogClose()
  }

  useEffect(() => {
    if (imgAttachment) {
      openDialog(
        {
          children: (
            <PreviewAttachment
              type="image"
              attachment={imgAttachment}
              onSend={handleSend}
            />
          ),
          props: { sx: { p: 0 } },
        },
        {
          dialogProps: {
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleDialogClose,
            TransitionComponent: Transition,
          },
          dialogHeader: {
            children: <DialogHeader title={"Send Image"} />,
            props: { sx: { p: 0 } },
          },
        }
      );
    }
  }, [imgAttachment]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audAttachment) {
      openDialog(
        {
          children: (
            <PreviewAttachment
              type="audio"
              attachment={audAttachment}
              onSend={handleSend}
            />
          ),
          props: { sx: { p: 0 } },
        },
        {
          dialogProps: {
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleDialogClose,
            TransitionComponent: Transition,
          },
          dialogHeader: {
            children: <DialogHeader title={"Send Audio"} />,
            props: { sx: { p: 0 } },
          },
        }
      );
    }
  }, [audAttachment]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (vidAttachment) {
      openDialog(
        {
          children: (
            <PreviewAttachment
              type="video"
              attachment={vidAttachment}
              onSend={handleSend}
            />
          ),
          props: { sx: { p: 0 } },
        },
        {
          dialogProps: {
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleDialogClose,
            TransitionComponent: Transition,
          },
          dialogHeader: {
            children: <DialogHeader title={"Send Video"} />,
            props: { sx: { p: 0 } },
          },
        }
      );
    }
  }, [vidAttachment]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={classes.msgBox}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{ display: "flex" }}
      >
        {["image", "audio", "video"].map((inputAccept, i) => (
          <input
            key={i}
            type="file"
            accept={`${inputAccept}/*`}
            ref={(ref) => inputEl.current.push(ref)}
            style={inputStyle}
            onChange={(e) => handleAttachmentChange(e)}
            name={inputAccept}
          />
        ))}
        <TextField
          variant="outlined"
          color="primary"
          sx={classes.input}
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <ImageIcon
                    onClick={() => handleAttachment("image")}
                    sx={iconStyle}
                  />
                </InputAdornment>
                <InputAdornment position="end">
                  <AudioFileIcon
                    onClick={() => handleAttachment("audio")}
                    sx={iconStyle}
                  />
                </InputAdornment>
                <InputAdornment position="end">
                  <VideoFileIcon
                    onClick={() => handleAttachment("video")}
                    sx={iconStyle}
                  />
                </InputAdornment>
                <InputAdornment position="end">
                  <Fab
                    type="submit"
                    color="primary"
                    aria-label="send message"
                    disabled={msg.length === 0}
                    sx={{ width: "35px", height: "35px" }}
                  >
                    <SendIcon sx={{ fontSize: "18px" }} />
                  </Fab>
                </InputAdornment>
              </>
            ),
          }}
          multiline
          fullWidth
          autoFocus
        />
      </form>
    </Box>
  );
}

export default SendMsg;
