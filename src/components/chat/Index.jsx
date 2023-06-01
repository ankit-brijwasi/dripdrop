import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import EditNoteIcon from "@mui/icons-material/EditNote";
import MessageIcon from "@mui/icons-material/Message";

import { useDialog } from "../../hooks/useDialog";
import { DialogBody, DialogHeader } from "./NewChatDialog";

export default function ChatIndex() {
  const { openDialog } = useDialog();
  const handleClick = (event) => {
    openDialog(
      { children: <DialogBody />, props: { sx: { m: 0, p: 0 } } },
      {
        dialogProps: {
          PaperProps: { sx: { minWidth: "500px", borderRadius: "10px" } },
        },
        dialogHeader: {
          props: { sx: { padding: 0 } },
          children: <DialogHeader />,
        },
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "90vh",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column wrap",
      }}
    >
      <MessageIcon sx={{ marginBottom: 0.6, fontSize: "60px" }} />
      <Typography variant="subtitle1" gutterBottom>
        Start a new chat, by clicking on the New Chat button
      </Typography>
      <Button variant="contained" size="small" onClick={handleClick}>
        <EditNoteIcon sx={{ mr: 0.5 }} /> New chat
      </Button>
    </Box>
  );
}
