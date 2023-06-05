import { Query } from "appwrite";
import { v4 } from "uuid";
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
    v4(),
    {
      room_id: data.roomId,
      body: data.body,
      sent_on: data.sent_on.toISOString(),
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
    v4(),
    {
      user_id: user_id,
      connections: [connection_id],
    }
  );
}
