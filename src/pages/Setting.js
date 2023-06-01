// material ui modules
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

// custom modules
import { useAuth } from "../hooks/useAuth";

// images
import authImg from "../assets/auth.svg";
import basicInfo from "../assets/basic-info.svg";

export default function Setting() {
  const [auth] = useAuth();

  return (
    <Box
      sx={{
        padding: "0px 30px",
        width: "80%",
        margin: "auto",
      }}
    >
      <br />
      <br />
      <br />
      <br />
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="subtitle1">Basic Info</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Change your basic info
              </Typography>
            </div>
            <img
              src={basicInfo}
              alt="signing in"
              style={{
                width: "150px",
                height: "112px",
                objectFit: "contain",
                marginLeft: "auto",
                display: "block",
              }}
            />
          </Box>
          <List>
            <ListItemButton>
              <ListItemText primary="Name" />
              <ListItemSecondaryAction sx={{ textTransform: "capitalize" }}>
                {auth.user?.name}
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary="DOB" />
              <ListItemSecondaryAction>Not Given</ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary="Gender" />
              <ListItemSecondaryAction>Not Given</ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
      <br />
      <br />
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="subtitle1">
                Sign In {"&"} Contact Info
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Change the way on how we can contact you
              </Typography>
            </div>
            <img
              src={authImg}
              alt="signing in"
              style={{
                width: "150px",
                height: "112px",
                objectFit: "contain",
                marginLeft: "auto",
                display: "block",
              }}
            />
          </Box>
          <List>
            <ListItemButton>
              <ListItemText primary="Email" />
              <ListItemSecondaryAction>
                {auth.user?.email}
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary="Password" />
              <ListItemSecondaryAction>Change</ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
      <br />
      <br />
    </Box>
  );
}
