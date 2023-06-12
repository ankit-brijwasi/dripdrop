import { Fragment } from "react";

import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";

export default function SearchBox({ open, results, clearResults }) {
  const paper = {
    height: "auto",
    position: "absolute",
    transform: "translate(8px, 4px)",
    width: "42.3ch",
  };

  const ellipsis = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  return (
    <Grow
      in={open}
      style={{ transformOrigin: "0 0 0" }}
      onExit={(e) => {
        clearResults();
      }}
      mountOnEnter
      unmountOnExit
    >
      <Paper sx={paper}>
        <>
          <List
            component="nav"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Search results
              </ListSubheader>
            }
            dense
          >
            {results.map((result, i) => (
              <Fragment key={i}>
                <ListItemButton onClick={() => {}}>
                  <ListItemIcon>
                    {result.type.split("/")[0] === "image" && (
                      <ImageIcon fontSize="small" style={{ color: "#95f" }} />
                    )}
                    {result.type.split("/")[0] === "video" && (
                      <VideoFileIcon
                        fontSize="small"
                        style={{ color: "#95f" }}
                      />
                    )}
                    {result.type.split("/")[0] === "audio" && (
                      <AudioFileIcon
                        fontSize="small"
                        style={{ color: "#95f" }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={result.name} style={ellipsis} />
                </ListItemButton>
              </Fragment>
            ))}
          </List>
        </>
      </Paper>
    </Grow>
  );
}
