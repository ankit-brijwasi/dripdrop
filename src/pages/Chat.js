import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatsContainer from "../components/chat/ChatsContainer";
import SendMsg from "../components/chat/SendMsg";
import { useAuth } from "../hooks/useAuth";

const initialState = [];

export default function Chat() {
  const [chats, setChats] = useState(initialState);
  const [auth] = useAuth();
  let { userId } = useParams();

  useEffect(() => setChats([]), [userId]);

  const handleMsg = (msg) => {
    setChats((prevChats) => [
      ...prevChats,
      {
        message: msg,
        user: { $id: auth.user.$id, name: auth.user.name },
        profile: { img: "https://picsum.photos/seed/picsum/200/300" },
        sent_on: new Date(),
      },
    ]);
    // TODO: send the message to server,
    // user.$id of the user whose chat is right now opened(can be taken using the URL)
  };

  return (
    <>
      <ChatsContainer chats={chats} />
      <SendMsg sendMsg={handleMsg} />
    </>
  );
}
