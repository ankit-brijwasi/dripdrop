// react and material ui
import { createContext, useState } from "react";
import { databases } from "../appwrite/config";
import { v4 } from "uuid";

import { getContactFromUserId } from "../utils/helpers";

export const NewChatContext = createContext();

export function NewChatProvider({ children }) {
  const [connection, setConnection] = useState(null);

  const handleConnection = async (connection, currentUser) => {
    setConnection(connection);

    const contact = await getContactFromUserId(currentUser.$id);

    if (contact) {
      // contact exists so update the document
      await databases.updateDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_CONTACT_COLLECTION_ID,
        contact.$id,
        {
          connections: [...new Set([...contact.connections, connection.user_id])],
        }
      );
      return;
    }

    await databases.createDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_CONTACT_COLLECTION_ID,
      v4(),
      {
        user_id: currentUser.$id,
        connections: [connection.user_id],
      }
    );
  };

  return (
    <NewChatContext.Provider value={{ connection, handleConnection }}>
      {children}
    </NewChatContext.Provider>
  );
}
