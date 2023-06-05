// react and material ui
import { createContext, useState } from "react";
import { createOrupdateContact } from "../utils/helpers";

export const NewChatContext = createContext();

export function NewChatProvider({ children }) {
  const [connection, setConnection] = useState(null);

  const handleConnection = async (connection, currentUser) => {
    setConnection(connection);
    await createOrupdateContact(currentUser.$id, connection.user_id);
  };

  return (
    <NewChatContext.Provider value={{ connection, handleConnection }}>
      {children}
    </NewChatContext.Provider>
  );
}
