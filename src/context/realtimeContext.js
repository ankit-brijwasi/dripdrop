import { createContext, useEffect, useReducer } from "react";
import client from "../appwrite/config";
import { toast } from "react-toastify";
import { getProfileFromUserId, processRawMessage } from "../utils/helpers";
import { useAuth } from "../hooks/useAuth";

const dbId = process.env.REACT_APP_DATABASE_ID;
const postCollId = process.env.REACT_APP_POST_COLLECTION_ID;
const messageCollId = process.env.REACT_APP_MESSAGE_COLLECTION_ID;

const channels = [
  `databases.${dbId}.collections.${postCollId}.documents`,
  `databases.${dbId}.collections.${messageCollId}.documents`,
];

export const RealtimeContext = createContext();
const initialState = {
  post: {},
  message: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "posts_collection":
      return { ...state, post: action.payload };

    case "messages_collection":
      return { ...state, message: action.payload };

    default:
      return state;
  }
}

export const RealtimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [auth] = useAuth();

  useEffect(() => {
    const unsubscribe = client.subscribe(channels, (response) => {
      (async () => {
        try {
          if (response.channels[1].split(".")[3] === postCollId)
            dispatch({ type: "posts_collection", payload: response.payload });
          else if (response.channels[1].split(".")[3] === messageCollId) {
            let sent_to = await getProfileFromUserId(
              response.payload.room_id.split(".")[1]
            );

            if (auth?.user?.$id === sent_to.user_id) {
              let payload = await processRawMessage(response.payload);
              dispatch({
                type: "messages_collection",
                payload: { ...payload, sent_to },
              });
              toast(`${payload.sent_by.username} sent a new message`, {
                type: "info",
              });
            }
          }
        } catch (error) {
          console.log(error);
          toast("Unable to get data in realtime! Please refresh the page", {
            type: "error",
          });
        }
      })();
    });

    return () => (unsubscribe ? unsubscribe() : null);
  }, [auth?.user?.$id]);

  return (
    <RealtimeContext.Provider value={{ ...state }}>
      {children}
    </RealtimeContext.Provider>
  );
};
