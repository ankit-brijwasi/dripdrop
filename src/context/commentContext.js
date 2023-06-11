// react and material ui
import { createContext, useState } from "react";

export const CommentContext = createContext();

export function CommentProvider({ children }) {
  const [comment, setComment] = useState(null);

  const addComment = async (comment) => {
    setComment(comment);
  };

  return (
    <CommentContext.Provider value={{ comment, addComment }}>
      {children}
    </CommentContext.Provider>
  );
}
