// react and material ui
import { createContext, forwardRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

export const DialogContext = createContext();

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = {
  TransitionComponent: Transition,
};

export function DialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState(initialState);
  const [dialogHeader, setDialogHeader] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogActions, setDialogActions] = useState(null);

  const openDialog = (dialogContent, props) => {
    setDialogContent(dialogContent);

    if (props) {
      if (props.dialogProps) setDialogProps(props.dialogProps);
      if (props.dialogHeader) setDialogHeader(props.dialogHeader);
      if (props.dialogActions) setDialogActions(props.dialogActions);
    }
    setOpen(!open);
  };

  const closeDialog = () => {
    setDialogContent(null);
    setDialogHeader(null);
    setDialogActions(null);
    setOpen(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <Dialog open={open} onClose={closeDialog} {...dialogProps}>
        {dialogHeader && (
          <DialogTitle {...dialogHeader.props}>
            {dialogHeader.children}
          </DialogTitle>
        )}
        {dialogContent && (
          <DialogContent {...dialogContent.props}>
            {dialogContent.children}
          </DialogContent>
        )}
        {dialogActions && (
          <DialogActions {...dialogActions.props}>
            {dialogActions.children}
          </DialogActions>
        )}
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
}
