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

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function Post({ style, openComments }) {
  return (
    <Card sx={{ width: "600px", mb: 2, ...style }}>
      <CardHeader
        avatar={
          <Avatar sx={{ marginRight: -1 }} aria-label="recipe">
            J
          </Avatar>
        }
        title="Jhon Doe"
        subheader={
          <span style={{ fontSize: "12px", marginTop: -2, display: "block" }}>
            3 m
          </span>
        }
        action={
          <IconButton aria-label="settings">
            <BookmarkBorderIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ marginTop: -2.5 }}>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="600px"
        image="https://picsum.photos/650"
        alt="post caption"
        sx={{ objectFit: "contain", mb: 1 }}
      />
      <CardActions sx={{ mb: 1 }}>
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
              10K
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
              10 comments
            </span>
          </Box>
        </div>
      </CardActions>
      <Divider sx={{ mx: 1.9 }} />
      <CardActions>
        <Box sx={{ mx: 1.2, width: "100%" }}>
          <Button color="inherit" sx={{ width: "50%" }}>
            <ThumbUpOutlinedIcon
              fontSize="small"
              sx={{ color: "rgb(200, 200, 200)" }}
            />
            <span style={{ marginLeft: "6px", color: "rgb(200, 200, 200)" }}>
              Like
            </span>
          </Button>
          <Button onClick={openComments} color="inherit" sx={{ width: "50%" }}>
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
