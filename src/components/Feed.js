import { useEffect, useMemo, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import { databases } from "../appwrite/config";
import { useAuth } from "../hooks/useAuth";
import { formatTimeAgo, likePost, unlikePost } from "../utils/helpers";
import { RenderCarousel } from "./Carousel";
import Link from "./Link";

export default function Feed(props) {
  const [post, setPost] = useState(props.post);
  const [auth] = useAuth();
  const dateTime = useMemo(
    () => new Date(props.post.posted_on),
    [props.post.posted_on]
  );
  const [currentTime, setCurrentTime] = useState(formatTimeAgo(dateTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTimeAgo(dateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [dateTime]);

  const toggleLike = async () => {
    if (!post.liked_by.find((user) => user === auth?.user?.$id)) {
      // post is liked
      setPost((prevState) => ({
        ...prevState,
        liked_by: [...new Set([...prevState.liked_by, auth?.user?.$id])],
      }));
      await likePost(post, auth);
      return;
    }

    setPost((prevState) => ({
      ...prevState,
      liked_by: prevState.liked_by.filter((user) => user !== auth?.user?.$id),
    }));
    await unlikePost(post, auth);
  };

  const toggleBookmark = async () => {
    if (!post.saved_by.find((user) => user === auth?.user?.$id)) {
      setPost((prevState) => ({
        ...prevState,
        saved_by: [...new Set([...prevState.saved_by, auth?.user?.$id])],
      }));
      await databases.updateDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_POST_COLLECTION_ID,
        post?.$id,
        {
          saved_by: [...new Set([...post.saved_by, auth?.user?.$id])],
        }
      );
      return;
    }

    setPost((prevState) => ({
      ...prevState,
      saved_by: prevState.saved_by.filter((user) => user !== auth?.user?.$id),
    }));
    await databases.updateDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_POST_COLLECTION_ID,
      post?.$id,
      {
        saved_by: post.saved_by.filter((user) => user !== auth?.user?.$id),
      }
    );
  };

  return (
    <Card sx={{ width: "600px", mb: 2, position: "relative", ...props.style }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ marginRight: -1 }}
            src={post.profile.profile_image.href}
            aria-label="recipe"
          />
        }
        title={
          <Link
            href={`/${post.profile.user_id}`}
            sx={{ color: "rgb(220, 220, 220)" }}
          >
            {post.profile.username}
          </Link>
        }
        subheader={
          <span style={{ fontSize: "12px", marginTop: -2, display: "block" }}>
            {currentTime}
          </span>
        }
        action={
          <>
            <IconButton onClick={toggleBookmark} aria-label="bookmark">
              {post.saved_by.find((user) => user === auth?.user?.$id) ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </>
        }
      />
      <CardContent sx={{ marginTop: -2.5 }}>
        {post.caption && (
          <Typography variant="body2" color="text.secondary">
            {post.caption}
          </Typography>
        )}
      </CardContent>
      {post.files.length > 0 && post.files.length > 1 ? (
        <RenderCarousel images={post.files.map((file) => file.file.href)} />
      ) : (
        <CardMedia
          component="img"
          height="500px"
          image={post.files[0].file.href}
          alt="post caption"
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardActions sx={{ mb: 1, mt: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ mx: 1.1, display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#358ade", width: 20, height: 20 }}>
              <ThumbUpIcon style={{ color: "#fff", fontSize: "12px" }} />
            </Avatar>
            <span
              style={{
                marginLeft: "4px",
                fontSize: "13px",
                color: "rgb(180, 180, 180)",
              }}
            >
              {post.liked_by.length}
            </span>
          </Box>
          <Box sx={{ mx: 1.1, display: "flex", alignItems: "center" }}>
            <span
              style={{
                marginLeft: "4px",
                fontSize: "13px",
                color: "rgb(180, 180, 180)",
              }}
            >
              {post.comments.length} comments
            </span>
          </Box>
        </div>
      </CardActions>
      <Divider sx={{ mx: 1.9 }} />
      <CardActions>
        <Box sx={{ mx: 1.2, width: "100%" }}>
          <Button color="inherit" onClick={toggleLike} sx={{ width: "50%" }}>
            {post.liked_by.find((user) => user === auth?.user?.$id) ? (
              <ThumbUpIcon
                fontSize="small"
                sx={{ color: "rgb(200, 200, 200)" }}
              />
            ) : (
              <ThumbUpOutlinedIcon
                fontSize="small"
                sx={{ color: "rgb(200, 200, 200)" }}
              />
            )}
            <span style={{ marginLeft: "6px", color: "rgb(200, 200, 200)" }}>
              {post.liked_by.find((user) => user === auth?.user?.$id)
                ? "Unlike"
                : "Like"}
            </span>
          </Button>
          <Button
            onClick={() => props.openComments(post)}
            color="inherit"
            sx={{ width: "50%" }}
          >
            <CommentIcon
              fontSize="small"
              sx={{ color: "rgb(200, 200, 200)" }}
            />
            <span style={{ marginLeft: "6px", color: "rgb(200, 200, 200)" }}>
              Comment
            </span>
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

