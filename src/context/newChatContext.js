// react and material ui
import { createContext, useState } from "react";

export const NewChatContext = createContext();

export function NewChatProvider({ children }) {
  const [connection, setConnection] = useState(null);

  const handleConnection = (connection) => setConnection(connection);

  return (
    <NewChatContext.Provider value={{ connection, handleConnection }}>
      {children}
    </NewChatContext.Provider>
  );
}
