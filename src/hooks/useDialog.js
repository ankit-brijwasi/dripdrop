import { useContext } from "react";
import { DialogContext } from "../context/dialogContext";

export function useDialog() {
  return useContext(DialogContext);
}
