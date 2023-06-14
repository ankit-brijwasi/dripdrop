// react modules
import { useEffect, useRef, Fragment, useState } from "react";

// material ui components
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { formatTimeAgo } from "../../utils/helpers";

const FormattedDate = ({ date }) => {
  const [currentTime, setCurrentTime] = useState(formatTimeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTimeAgo(date));
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return currentTime;
};

// ChatsContainer: All the chats are displayed here
function ChatsContainer({ chats }) {
  const elRef = useRef(null);

  useEffect(() => {
    elRef.current.scrollTo({
      top: elRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats]);

  const attachmentStyle = {
    width: "300px",
    height: "250px",
    objectFit: "cover",
    display: "block",
    marginRight: "auto",
  };

  return (
    <Box
      sx={{
        marginTop: "18px",
        height: "calc(94vh - 70px)",
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
                  alt={chat.sent_by.username}
                  src={chat.sent_by.profile_image.href}
                  style={{ backgroundColor: "#d2d2d2" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <strong style={{ color: "rgb(225, 225, 225)" }}>
                    {chat.sent_by.username}
                  </strong>
                }
                secondary={
                  <>
                    {chat.body && (
                      <>
                        <Typography
                          component="span"
                          variant="body1"
                          color={"rgb(215, 215, 215)"}
                        >
                          {chat.body}
                        </Typography>
                        <br />
                      </>
                    )}
                    {chat.attached_files.length > 0 && (
                      <>
                        {chat.attached_files.map((file, i) => (
                          <Fragment key={i}>
                            {file.metadata.mimeType.includes("image") && (
                              <img
                                src={file.file.href}
                                alt="attached file"
                                style={attachmentStyle}
                              />
                            )}
                            {file.metadata.mimeType.includes("video") && (
                              <video
                                preload="none"
                                style={attachmentStyle}
                                controls
                              >
                                <source src={file.file.href} />
                              </video>
                            )}
                            {file.metadata.mimeType.includes("audio") && (
                              <audio
                                preload="none"
                                controls
                                style={{ display: "block" }}
                              >
                                <source src={file.file.href} />
                              </audio>
                            )}
                          </Fragment>
                        ))}
                      </>
                    )}
                    <span style={{ fontSize: "10px" }}>
                      <FormattedDate date={chat.sent_on} />
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
