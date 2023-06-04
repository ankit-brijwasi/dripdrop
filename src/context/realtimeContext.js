import { createContext, useEffect, useReducer } from "react";
import client from "../appwrite/config";

const dbId = process.env.REACT_APP_DATABASE_ID;
const collId = process.env.REACT_APP_POST_COLLECTION_ID;

export const RealtimeContext = createContext();
const initialState = {
  post: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "posts_collection":
      return { ...state, post: action.post };
    default:
      return state;
  }
}

export const RealtimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${collId}.documents`,
      (response) => {
        dispatch({ type: "posts_collection", post: response.payload });
      }
    );

    return () => (unsubscribe ? unsubscribe() : null);
  }, []);

  return (
    <RealtimeContext.Provider value={{ ...state }}>
      {children}
    </RealtimeContext.Provider>
  );
};
