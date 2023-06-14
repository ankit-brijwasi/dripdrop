import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ChatsContainer from "../components/chat/ChatsContainer";
import SendMsg from "../components/chat/SendMsg";
import Loading from "../components/Loading";

import { useAuth } from "../hooks/useAuth";

import {
  createOrupdateContact,
  getMessageHistory,
  saveMsgToCollection,
} from "../utils/helpers";
import { useRealtime } from "../hooks/useRealtime";

export default function Chat() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  let { userId } = useParams();
  const { message } = useRealtime();

  const [auth] = useAuth();

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (auth?.user) {
        try {
          const messages = await getMessageHistory([
            `${auth.user.$id}.${userId}`,
            `${userId}.${auth.user.$id}`,
          ]);
          setChats(messages);
        } catch (error) {
          toast(error?.response?.message, { type: "error" });
        }
      }
    })();
    setLoading(false);

    return () => {
      setLoading(true);
      setChats([]);
    };
  }, [userId, auth]);

  useEffect(() => {
    if (message?.sent_to?.user_id === auth?.user?.$id) {
      if (message?.sent_by?.user_id === userId) {
        setChats((prevState) => [...prevState, message]);
      }
    }
  }, [message, auth, userId]);

  const handleMsg = async (msg, files) => {
    try {
      await createOrupdateContact(userId, auth.user.$id);

      console.log(files);
      const payload = await saveMsgToCollection({
        roomId: `${auth.user.$id}.${userId}`,
        body: msg,
        sent_on: new Date(),
        attached_files: files,
      });
      setChats((prevState) => [...prevState, payload]);
    } catch (error) {
      toast(error?.response?.message, { type: "error" });
    }
  };

  return loading ? (
    <Loading message={"loading chats..."} />
  ) : (
    <>
      <ChatsContainer chats={chats} />
      <SendMsg sendMsg={handleMsg} />
    </>
  );
}
