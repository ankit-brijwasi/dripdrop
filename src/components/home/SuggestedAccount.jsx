import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import { useAuth } from "../../hooks/useAuth";
import { useFollow } from "../../hooks/useFollow";
import { useState } from "react";

export default function SuggestedAccount(props) {
  const [auth] = useAuth();
  const [followers, setFollowers] = useState(props.followers);
  const { follow, unfollow } = useFollow();

  const handleFollow = async () => {
    setFollowers((prevState) => [...prevState, auth.user.$id]);
    await follow(props.id);
  };

  const handleUnfollow = async () => {
    setFollowers((prevState) =>
      prevState.filter((follower) => follower !== auth.user.$id)
    );
    await unfollow(props.id);
  };

  return (
    <List dense={true}>
      <ListItem
        secondaryAction={
          <>
            {followers.find((follower) => follower === auth?.user?.$id) ? (
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "12px" }}
                onClick={handleUnfollow}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                variant="outlined"
                size="small"
                sx={{ fontSize: "12px" }}
              >
                Follow
              </Button>
            )}
          </>
        }
        disablePadding
      >
        <ListItemButton component={Link} to={"/" + props.id}>
          <ListItemAvatar sx={{ marginRight: -0.5 }}>
            <Avatar
              alt={props.name}
              sx={{
                width: 35,
                height: 35,
                objectFit: "contain",
                border: "1px solid #555",
              }}
              src={props.profile_image}
            />
          </ListItemAvatar>
          <ListItemText
            primary={props.name}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
