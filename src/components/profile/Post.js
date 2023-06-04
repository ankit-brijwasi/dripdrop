import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { databases, storage } from "../../appwrite/config";
import { useRealtime } from "../../hooks/useRealtime";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../Loading";
import Empty from "../Empty";

const getFilePreview = (file_id) =>
  storage.getFilePreview(
    process.env.REACT_APP_USER_DATA_BUCKET,
    file_id,
    400,
    400
  );

export default function Post({ fetchQuery }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { post } = useRealtime();
  const [auth] = useAuth();

  // fetch posts
  useEffect(() => {
    (async () => {
      try {
        let docs = await databases.listDocuments(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_POST_COLLECTION_ID,
          fetchQuery
        );

        docs = docs.documents.reverse().map((doc) => {
          let preview = null;
          if (doc.file_ids.length > 0)
            preview = getFilePreview(doc.file_ids[0]);
          return { ...doc, preview };
        });
        if (docs) setPosts(docs);
      } catch (error) {
        toast(error.response.message, { type: "error" });
      }
      setLoading(false);
    })();
  }, [fetchQuery]);

  // handle async posts
  useEffect(() => {
    if (post.user_id === auth.user.$id) {
      setPosts((prevState) => {
        if (prevState.find((prevPost) => prevPost.$id === post.$id))
          return prevState;

        let preview = null;
        if (post.file_ids.length > 0)
          preview = getFilePreview(post.file_ids[0]);
        return [{ ...post, preview }, ...prevState];
      });
    }
  }, [post, auth.user.$id]);

  return loading ? (
    <Loading style={{ minHeight: "65vh" }} />
  ) : (
    <>
      {posts.length === 0 ? (
        <Empty style={{ minHeight: "60vh" }} />
      ) : (
        <ImageList cols={3}>
          {posts.map((post) => (
            <ImageListItem key={post.$id} sx={{ position: "relative" }}>
              {post.preview ? (
                <img
                  src={post.preview.href}
                  srcSet={post.preview.href}
                  alt={post.caption}
                  loading="lazy"
                />
              ) : (
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(100, 100, 100)",
                    padding: "8px",
                  }}
                >
                  {post.caption}
                </span>
              )}
              {post.file_ids?.length > 1 && (
                <PhotoLibraryIcon
                  sx={{ position: "absolute", right: 10, top: 10 }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  );
}
