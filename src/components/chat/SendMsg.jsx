// react modules
import { useState } from "react";

// material ui components
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

// material ui icons
import SendIcon from "@mui/icons-material/Send";

// material ui hooks
import { useTheme } from "@mui/material/styles";

// SendMsg: Text Box component where the user can type message and send it
function SendMsg({ sendMsg }) {
  const [msg, setMsg] = useState("");
  const theme = useTheme();
  
  document.onkeydown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) handleSubmit();
  };

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

  return (
    <Box sx={classes.msgBox}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{ display: "flex" }}
      >
        <TextField
          variant="outlined"
          color="primary"
          sx={classes.input}
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Fab
                  type="submit"
                  color="primary"
                  aria-label="send message"
                  disabled={msg.length === 0}
                  size="medium"
                >
                  <SendIcon fontSize="small" />
                </Fab>
              </InputAdornment>
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
