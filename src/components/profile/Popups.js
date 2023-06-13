import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import useComment from "../../hooks/useComment";
import { useAuth } from "../../hooks/useAuth";
import Link from "../Link";
import { RenderCarousel } from "../Carousel";
import { CommentDialogActions, CommentDialogBody } from "../home/Popups";
import { formatTimeAgo, likePost, unlikePost } from "../../utils/helpers";

const PostData = ({ post, toggleLike }) => {
  const [auth] = useAuth();
  const [isLiked, setIsLiked] = useState(
    Boolean(post.liked_by.find((user) => user === auth?.user?.$id))
  );

  const handleClick = async (event) => {
    setIsLiked(await toggleLike(post, auth));
  };

  return (
    <div style={{ paddingTop: "5px", position: "relative" }}>
      <ListItem sx={{ alignItems: "flex-start", px: 1 }}>
        <ListItemAvatar>
          <Avatar
            alt={post.userProfile.username}
            sx={{
              width: 35,
              height: 35,
              objectFit: "contain",
              border: "1px solid #555",
              marginLeft: "auto",
              marginRight: "15px",
              marginTop: "3px",
            }}
            src={post.userProfile.profile_image.href}
          />
        </ListItemAvatar>
        <ListItemText
          sx={{ mt: 0 }}
          primary={
            <Link
              href={`/${post.user_id}`}
              sx={{ color: "rgb(240, 240, 240)", display: "inline-block" }}
            >
              <span style={{ fontSize: "14px" }}>
                {post.userProfile.username}
              </span>
            </Link>
          }
          secondary={
            <span style={{ marginTop: "1px", display: "block" }}>
              {post.caption && (
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ color: "rgb(230, 230, 230)", display: "block" }}
                >
                  {post.caption}
                </Typography>
              )}
              <span
                style={{
                  fontSize: "10px",
                  marginTop: "-1px",
                  display: "block",
                }}
              >
                {formatTimeAgo(new Date(post.posted_on))}
              </span>
            </span>
          }
        />
      </ListItem>
      <Divider />
      <IconButton
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onClick={handleClick}
      >
        {isLiked ? (
          <ThumbUpIcon fontSize="small" sx={{ color: "rgb(230, 230, 230)" }} />
        ) : (
          <ThumbUpOutlinedIcon
            fontSize="small"
            sx={{ color: "rgb(230, 230, 230)" }}
          />
        )}
      </IconButton>
    </div>
  );
};

const MetaData = ({ likes, comments }) => {
  return (
    <Box
      sx={{
        mx: 1.1,
        my: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex" }}>
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
          {likes}
        </span>
      </div>
      <span
        style={{
          marginLeft: "4px",
          fontSize: "13px",
          color: "rgb(180, 180, 180)",
        }}
      >
        {comments} comments
      </span>
    </Box>
  );
};

export default function PostBody({ post }) {
  const [likes, setLikes] = useState(post.liked_by.filter(Boolean));
  const [comments, setComments] = useState(post.comments.filter(Boolean));
  const { addComment } = useComment();

  const toggleLike = async (post, auth) => {
    if (!likes.find((user) => user === auth?.user?.$id)) {
      // post is liked
      setLikes((prevState) => [...new Set([...prevState, auth?.user?.$id])]);
      await likePost(post, auth);
      return true;
    }

    setLikes((prevState) =>
      prevState.filter((user) => user !== auth?.user?.$id)
    );
    await unlikePost(post, auth);
    return false;
  };

  const handleComment = (postId, comment) => {
    setComments((prevState) => [...prevState, comment.$id]);
    addComment(comment);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={7}>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            flexFlow: "column",
            height: "85.53vh",
          }}
        >
          {post.files.length > 0 && post.files.length > 1 ? (
            <RenderCarousel
              images={post.files.map((file) => file.file.href)}
              detailed={true}
            />
          ) : (
            <CardMedia
              component="img"
              height="796px"
              width="700px"
              sx={{ objectFit: "cover" }}
              image={post.files[0].file.href}
              alt={post.caption}
            />
          )}
        </div>
      </Grid>
      <Grid item xs={12} md={5}>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <PostData post={post} toggleLike={toggleLike} />
          <CommentDialogBody post={post} />
          <Divider />
          <MetaData likes={likes.length} comments={comments.length} />
          <br />
          <CommentDialogActions
            post={post}
            onCommentSuccess={handleComment}
            sx={{ px: 1, p: 0, mb: 0.6 }}
          />
        </div>
      </Grid>
    </Grid>
  );
}
