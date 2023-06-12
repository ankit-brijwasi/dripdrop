import { useContext } from "react";
import { FollowContext } from "../context/followContext";

export function useFollow() {
  return useContext(FollowContext);
}
