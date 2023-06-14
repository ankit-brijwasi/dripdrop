import { Query, ID } from "appwrite";
import { account, databases, storage, functions } from "../appwrite/config";

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

export const processPostFile = (fileId) => {
  try {
    return new URL(fileId);
  } catch (_) {
    return storage.getFileView(process.env.REACT_APP_USER_DATA_BUCKET, fileId);
  }
};

export const getPreviewChatAttachments = (fileId) => {
  try {
    return new URL(fileId);
  } catch (_) {
    return storage.getFilePreview(
      process.env.REACT_APP_CHAT_DATA_BUCKET,
      fileId,
      100,
      100
    );
  }
};

export const getChatAttachments = (fileId) => {
  try {
    return new URL(fileId);
  } catch (_) {
    return storage.getFileView(process.env.REACT_APP_CHAT_DATA_BUCKET, fileId);
  }
};

export const getPostFilePreview = (fileId, x = 40, y = 40) => {
  try {
    return new URL(fileId);
  } catch (_) {
    return storage.getFilePreview(
      process.env.REACT_APP_USER_DATA_BUCKET,
      fileId,
      x,
      y
    );
  }
};

export const processProfile = (profile) => {
  return {
    ...profile,
    profile_image: processProfileImg(profile.profile_image),
    followers: profile.followers.filter(Boolean),
    following: profile.following.filter(Boolean),
  };
};

export const processChatAttachments = async (attachment) => {
  return {
    file: getChatAttachments(attachment),
    metadata: await storage.getFile(
      process.env.REACT_APP_CHAT_DATA_BUCKET,
      attachment
    ),
  };
};

export async function getProfileFromUserId(userId) {
  const docs = await databases.listDocuments(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_PROFILE_COLLECTION_ID,
    [Query.equal("user_id", userId)]
  );

  if (docs.total > 0) {
    const profile = docs.documents[0];
    return processProfile(profile);
  }

  // this should ideally never happen
  return {};
}

export async function getContactFromUserId(userId, processConnections = false) {
  const docs = await databases.listDocuments(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_CONTACT_COLLECTION_ID,
    [Query.equal("user_id", userId)]
  );

  if (docs.total > 0) {
    const contact = docs.documents[0];
    if (!processConnections)
      return {
        ...contact,
        connections: contact.connections.filter(Boolean).reverse(),
      };

    return {
      ...contact,
      connections: await Promise.all(
        contact.connections
          .filter(Boolean)
          .map(async (connection) => await getProfileFromUserId(connection))
          .reverse()
      ),
    };
  }

  // this should ideally never happen
  return null;
}

export async function processRawMessage(msg) {
  return {
    ...msg,
    sent_by: await getProfileFromUserId(msg.room_id.split(".")[0]),
    sent_on: new Date(msg.sent_on),
    attached_files: await Promise.all(msg.attached_files.map(processChatAttachments)),
  };
}

export async function getMessageHistory(roomId) {
  const docs = await databases.listDocuments(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_MESSAGE_COLLECTION_ID,
    [Query.equal("room_id", roomId)]
  );

  const messages = await Promise.all(docs.documents.map(processRawMessage));
  return messages;
}

export async function saveMsgToCollection(data) {
  const msg = await databases.createDocument(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_MESSAGE_COLLECTION_ID,
    ID.unique(),
    {
      room_id: data.roomId,
      body: data.body,
      sent_on: data.sent_on.toISOString().replace("Z", "+00:00"),
      attached_files: data.attached_files,
    }
  );
  return await processRawMessage(msg);
}

export async function createOrupdateContact(user_id, connection_id) {
  const contact = await getContactFromUserId(user_id);

  if (contact) {
    // contact exists so update the document
    await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_CONTACT_COLLECTION_ID,
      contact.$id,
      {
        connections: [...new Set([...contact.connections, connection_id])],
      }
    );
    return;
  }

  await databases.createDocument(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_CONTACT_COLLECTION_ID,
    ID.unique(),
    {
      user_id: user_id,
      connections: [connection_id],
    }
  );
}

export async function getJwtToken() {
  function hasExpired(expiry) {
    const expiryDate = new Date(expiry);
    return expiryDate <= new Date();
  }

  const jwt = JSON.parse(localStorage.getItem("jwt"));

  if (!jwt || hasExpired(jwt.expiry)) {
    const data = await account.createJWT();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    const newData = { accessToken: data.jwt, expiry: expiry.toISOString() };

    localStorage.setItem("jwt", JSON.stringify(newData));

    setInterval(async () => {
      const newData = await account.createJWT();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 15);
      const updatedData = {
        accessToken: newData.jwt,
        expiry: expiry.toISOString(),
      };

      localStorage.setItem("jwt", JSON.stringify(updatedData));
    }, 15 * 60 * 1000);

    return data.jwt;
  }

  const expiry = new Date(jwt.expiry);
  setInterval(
    () => localStorage.removeItem("jwt"),
    expiry.getTime() - Date.now()
  );
  return jwt.accessToken;
}

export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // Time difference in seconds

  if (diff < 60) {
    return `${diff} sec ago`;
  } else if (diff < 60 * 60) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  } else if (diff < 60 * 60 * 24) {
    const hours = Math.floor(diff / (60 * 60));
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // Format for older dates, you can modify this part based on your requirements
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export async function unlikePost(post, auth) {
  await databases.updateDocument(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_POST_COLLECTION_ID,
    post?.$id,
    {
      liked_by: post.liked_by.filter((user) => user !== auth?.user?.$id),
    }
  );
}

export async function likePost(post, auth) {
  await databases.updateDocument(
    process.env.REACT_APP_DATABASE_ID,
    process.env.REACT_APP_POST_COLLECTION_ID,
    post?.$id,
    {
      liked_by: [...new Set([...post.liked_by, auth?.user?.$id])],
    }
  );

  await functions.createExecution(
    process.env.REACT_APP_GENERATE_NOTIFICATION_FUNC,
    JSON.stringify({
      updated_field: "liked_by",
      user_id: auth.user.$id,
      action: "like",
      post_id: post.$id,
    })
  );
}

export function searchAndArrangeArray(arr, keyword, property) {
  function calculateLevenshteinDistance(a, b) {
    const distanceMatrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
      distanceMatrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
      distanceMatrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        distanceMatrix[j][i] = Math.min(
          distanceMatrix[j][i - 1] + 1,
          distanceMatrix[j - 1][i] + 1,
          distanceMatrix[j - 1][i - 1] + indicator
        );
      }
    }

    return distanceMatrix[b.length][a.length];
  }

  const comparator = (a, b) => {
    const aValue = a[property].toLowerCase();
    const bValue = b[property].toLowerCase();

    const aMatch = aValue.includes(keyword.toLowerCase());
    const bMatch = bValue.includes(keyword.toLowerCase());

    if (aMatch && !bMatch) {
      return -1;
    } else if (!aMatch && bMatch) {
      return 1;
    } else {
      const aDistance = calculateLevenshteinDistance(
        aValue,
        keyword.toLowerCase()
      );
      const bDistance = calculateLevenshteinDistance(
        bValue,
        keyword.toLowerCase()
      );

      return aDistance - bDistance;
    }
  };

  const sortedArr = arr.sort(comparator);

  return sortedArr;
}
