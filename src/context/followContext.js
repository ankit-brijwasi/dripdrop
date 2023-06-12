// react and material ui
import { createContext } from "react";
import { databases, functions } from "../appwrite/config";
import { useAuth } from "../hooks/useAuth";
import { getProfileFromUserId, processProfile } from "../utils/helpers";

export const FollowContext = createContext();

export function FollowProvider({ children }) {
  const [auth, dispatch] = useAuth();

  const follow = async (user_id) => {
    const updated_profile = await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_PROFILE_COLLECTION_ID,
      auth.user.profile.$id,
      {
        following: [...new Set([...auth.user.profile.following, user_id])],
      }
    );

    let followUserProfile = await getProfileFromUserId(user_id);
    await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_PROFILE_COLLECTION_ID,
      followUserProfile.$id,
      {
        followers: [
          ...new Set([...followUserProfile.followers, auth.user.$id]),
        ],
      }
    );

    dispatch({
      type: "update-profile",
      profile: processProfile(updated_profile),
    });

    await functions.createExecution(
      process.env.REACT_APP_GENERATE_NOTIFICATION_FUNC,
      JSON.stringify({
        updated_field: "comments",
        profile_id: auth.user.profile.$id,
        action: "follow",
        followed_user_id: user_id,
      })
    );
  };

  const unfollow = async (user_id) => {
    const updated_profile = await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_PROFILE_COLLECTION_ID,
      auth.user.profile.$id,
      {
        following: auth.user.profile.following.filter(followingUser => followingUser !== user_id)
      }
    );

    let followUserProfile = await getProfileFromUserId(user_id);
    await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_PROFILE_COLLECTION_ID,
      followUserProfile.$id,
      {
        followers: followUserProfile.followers.filter(
          (follower) => follower !== auth.user.$id
        ),
      }
    );

    dispatch({
      type: "update-profile",
      profile: processProfile(updated_profile),
    });
  };

  return (
    <FollowContext.Provider value={{ follow, unfollow }}>
      {children}
    </FollowContext.Provider>
  );
}
