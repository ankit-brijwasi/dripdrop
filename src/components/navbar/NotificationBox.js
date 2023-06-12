import { Query } from "appwrite";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/ModeComment";

import { databases } from "../../appwrite/config";
import { useAuth } from "../../hooks/useAuth";

import Loading from "../Loading";
import Empty from "../Empty";
import { formatTimeAgo } from "../../utils/helpers";


export default function NotificationBox({ open }) {
  const paper = {
    height: "auto",
    position: "absolute",
    right: "20px",
    top: "50px",
    zIndex: 10,
    width: "500px",
  };

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    if (auth?.user?.$id) {
      (async () => {
        try {
          const { documents } = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_NOTIFICATION_COLLECTION_ID,
            [Query.equal("user_id", auth.user.$id)]
          );
          if (documents.length > 0) {
            setNotifications(documents.reverse());
          }
        } catch (error) {
          if (error?.response?.text)
            toast(error?.response?.text, { type: "error" });
          else {
            console.log(error);
            toast("Something went wrong", { type: "error" });
          }
        }
      })();
      setLoading(false);
    }

    return () => {
      setLoading(true);
      setNotifications([]);
    };
  }, [auth?.user?.$id]);

  return (
    open && (
      <Paper sx={paper}>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Notifications
            </ListSubheader>
          }
          sx={{ height: "500px", overflowY: "auto" }}
        >
          {loading ? (
            <Loading style={{ minHeight: "45vh" }} />
          ) : (
            <>
              {notifications.length === 0 && (
                <Empty style={{ minHeight: "45vh" }} />
              )}
              {notifications.map((result, i) => (
                <Fragment key={i}>
                  <ListItem key={i} alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "#358ade",
                          width: 20,
                          height: 20,
                          marginTop: 0.35
                        }}
                      >
                        {result.message.includes("liked") && (
                          <ThumbUpIcon
                            style={{ color: "#fff", fontSize: "12px" }}
                          />
                        )}
                        {result.message.includes("commented") && (
                          <CommentIcon
                            style={{ color: "#fff", fontSize: "12px" }}
                          />
                        )}
                      </Avatar>
                    </ListItemIcon>
                    <Link
                      to={"/"}
                      style={{ fontSize: "10px", textDecoration: "none" }}
                    >
                      <ListItemText
                        primary={result.message}
                        secondary={formatTimeAgo(new Date(result.created_on))}
                        sx={{
                          color: "rgb(220, 220, 220)",
                          marginLeft: -3,
                        }}
                      />
                    </Link>
                  </ListItem>
                  {notifications.length !== 1 && (
                    <Divider sx={{ mx: "10px" }} />
                  )}
                </Fragment>
              ))}
            </>
          )}
        </List>
      </Paper>
    )
  );
}
