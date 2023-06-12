import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";

import client from "../appwrite/config";
import { useAuth } from "../hooks/useAuth";
import { getProfileFromUserId, processRawMessage } from "../utils/helpers";

const dbId = process.env.REACT_APP_DATABASE_ID;
const postCollId = process.env.REACT_APP_POST_COLLECTION_ID;
const messageCollId = process.env.REACT_APP_MESSAGE_COLLECTION_ID;
const notificationCollId = process.env.REACT_APP_NOTIFICATION_COLLECTION_ID;

const channels = [
  `databases.${dbId}.collections.${postCollId}.documents`,
  `databases.${dbId}.collections.${messageCollId}.documents`,
  `databases.${dbId}.collections.${notificationCollId}.documents`,
];

export const RealtimeContext = createContext();
const initialState = {
  post: {},
  message: null,
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "posts_collection":
      return { ...state, post: action.payload };

    case "messages_collection":
      return { ...state, message: action.payload };

    case "notifications_collection":
      return { ...state, notification: action.payload };

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
          if (response.channels[1].split(".")[3] === postCollId) {
            dispatch({ type: "posts_collection", payload: response.payload });
          }
          
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
              toast(
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{payload.sent_by.username} sent a new message</span>
                  <a
                    href={`/chats/${payload.sent_by.user_id}`}
                    style={{
                      whiteSpace: "nowrap",
                      textDecoration: "none",
                      color: "#0099cc",
                    }}
                  >
                    View
                  </a>
                </div>,
                {
                  type: "info",
                  style: {
                    alignItems: "flex-start",
                  },
                }
              );
            }
          }
          
          else if (response.channels[1].split(".")[3] === notificationCollId) {
            if (auth.user.$id === response.payload.user_id) {
              dispatch({
                type: "notifications_collection",
                payload: response.payload,
              });
              toast(`${response.payload.message}`, {
                type: "info",
                position: "top-left",
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
