// react modules
import { useEffect, useRef, Fragment } from "react";

// material ui components
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

// ChatsContainer: All the chats between two persons are displayed here
function ChatsContainer({ chats }) {
  const elRef = useRef(null);

  useEffect(() => {
    elRef.current.scrollTo({
      top: elRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats]);

  return (
    <Box
      sx={{
        marginTop: "-18px",
        height: "calc(94vh - 55px)",
        overflowY: "auto",
      }}
      ref={elRef}
    >
      <List
        component="ul"
        sx={{
          display: "flex",
          flexFlow: "column wrap",
          justifyContent: "end",
          minHeight: "calc(94vh - 55px)",
          height: "auto",
          width: "100%",
        }}
      >
        {chats.map((chat, i) => (
          <Fragment key={i}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={chat.user.name}
                  src={chat.profile.img}
                  style={{ backgroundColor: "#d2d2d2" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <strong
                    style={{
                      color: "rgb(225, 225, 225)",
                      textTransform: "capitalize",
                    }}
                  >
                    {chat.user.name}
                  </strong>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body1"
                      color={"rgb(215, 215, 215)"}
                    >
                      {chat.message}
                    </Typography>
                    <br />
                    <span style={{ fontSize: "10px" }}>
                      {chat.sent_on.toString()}
                    </span>
                  </>
                }
              />
            </ListItem>
            {chats.length !== i + 1 && (
              <Divider variant="inset" component="li" />
            )}
          </Fragment>
        ))}
      </List>
    </Box>
  );
}

export default ChatsContainer;
