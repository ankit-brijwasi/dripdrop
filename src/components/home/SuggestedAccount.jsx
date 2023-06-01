import { Link } from "react-router-dom"

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

export default function SuggestedAccount({ id, name, profile_image }) {

  return (
    <List dense={true}>
      <ListItem
        secondaryAction={
          <Button variant="text" size="small" sx={{ fontSize: "12px" }}>
            Follow
          </Button>
        }
        disablePadding
      >
        <ListItemButton component={Link} to={"/" + id}>
          <ListItemAvatar sx={{ marginRight: -0.5 }}>
            <Avatar
              alt={name}
              sx={{
                width: 35,
                height: 35,
                objectFit: "contain",
                border: "1px solid #555",
              }}
              src={profile_image}
            />
          </ListItemAvatar>
          <ListItemText primary={name} sx={{ textTransform: "capitalize" }} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
