import { useContext } from "react";
import { RealtimeContext } from "../context/realtimeContext";

export function useRealtime() {
  return useContext(RealtimeContext);
}
