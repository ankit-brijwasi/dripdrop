// react and material ui
import { createContext, useEffect, useReducer } from "react";

import Box from "@mui/material/Box";

// custom modules
import { account } from "../appwrite/config";
import { getProfileFromUserId } from "../utils/helpers";
import Loading from "../components/Loading";

export const AuthContext = createContext();

const initialState = {
  authenticated: false,
  user: undefined,
  loading: true,
  error: null,
};

function signInUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  return { ...user };
}

function signOutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt");
  return null;
}

function updateUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  return { ...user };
}

function updateUserProfile(profile) {
  const user = JSON.parse(localStorage.getItem("user"));
  user.profile = profile;
  localStorage.setItem("user", JSON.stringify(user));
  return { ...user };
}

function reducer(state, action) {
  switch (action.type) {
    case "signin":
      return {
        authenticated: true,
        loading: false,
        user: signInUser(action.user),
        error: action.error,
      };
    case "signout":
      return {
        authenticated: false,
        loading: false,
        user: signOutUser(),
        error: action.error,
      };
    case "update":
      return {
        ...state,
        user: updateUser(action.user),
      };
    case "update-profile":
      return {
        ...state,
        user: updateUserProfile(action.profile),
      };

    case "error":
      return { error: action.error };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        const profile = await getProfileFromUserId(user.$id);

        dispatch({ type: "signin", user: { ...user, profile }, error: null });
      } catch (error) {
        dispatch({ type: "signout" });
      }
      return;
    })();
  }, []);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {state.loading ? (
        <Box sx={{ height: "100vh" }}>
          <Loading style={{ minHeight: "100%" }} message={"Loading DripDrop..."} />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
