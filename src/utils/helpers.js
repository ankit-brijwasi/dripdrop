import { Query } from "appwrite";
import { databases, storage } from "../appwrite/config";

export function processProfileImg(profileImg) {
  try {
    return new URL(profileImg);
  } catch (_) {
    return storage.getFilePreview(
      process.env.REACT_APP_PROFILE_IMAGE_BUCKET,
      profileImg,
      200,
      200
    );
  }
}

export async function getProfileFromUserId(userId) {
  const docs = await databases.listDocuments(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_PROFILE_COLLECTION_ID,
    [Query.equal("user_id", userId)]
  );

  if (docs.total > 0) {
    const profile = docs.documents[0];
    return {
      ...profile,
      profile_image: processProfileImg(profile.profile_image),
      followers: profile.followers.filter(Boolean),
      following: profile.following.filter(Boolean),
    };
  }

  // this should ideally never happen
  return {};
}
