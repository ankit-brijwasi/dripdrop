import { useContext } from "react";
import { NewChatContext } from "../context/newChatContext";

export function useNewChat() {
  return useContext(NewChatContext);
}
