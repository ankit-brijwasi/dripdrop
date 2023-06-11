import { useContext } from "react";
import { CommentContext } from "../context/commentContext";

export default function useComment() {
  return useContext(CommentContext);
}
