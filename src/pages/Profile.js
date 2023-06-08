// react and other modules
import { Query } from "appwrite";
import { useState } from "react";
import { Link } from "react-router-dom";

// material ui modules
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// material icons
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// HOC
import ProfileHoc from "../hoc/ProfileHOC";

// custom modules
import { useAuth } from "../hooks/useAuth";

// appwrite
import Post from "../components/profile/Post";

function tabProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "rgb(190, 190, 190)",
    top: 0,
  },
});

const CustomTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  color: "rgba(140, 140, 140, 0.85)",
  fontWeight: theme.typography.fontWeightRegular,
  fontFamily: "calibri",
  fontSize: 16,
  width: "110px",
  "&:hover": {
    color: "rgba(230, 230, 230)",
    opacity: 1,
    fontWeight: theme.typography.fontWeightBold,
  },
  "&.Mui-selected": {
    color: "rgba(230, 230, 230)",
    fontWeight: theme.typography.fontWeightBold,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(230, 230, 230)",
  },
}));

function Profile({ userId, profile, me }) {
  const [value, setValue] = useState(0);
  const [auth] = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "60%", margin: "auto" }}>
        <Grid container spacing={2}>
          <Grid item sm={12} lg={4}>
            <Avatar
              alt={profile?.username + " profile pic"}
              src={profile?.profile_image.href}
              sx={{
                width: 170,
                height: 170,
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={8}>
            <Stack
              direction="row"
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              spacing={2}
              sx={{ mb: 1.5 }}
            >
              {profile && (
                <>
                  <Box sx={{ marginTop: 0.5 }}>
                    <Typography variant="h6">{profile?.username}</Typography>
                    {me && (
                      <span
                        style={{
                          textTransform: "none",
                          fontSize: "14px",
                          display: "block",
                          fontWeight: "bold",
                          fontFamily: "calibri",
                          marginTop: "-5px",
                        }}
                      >
                        {auth?.user?.name}
                      </span>
                    )}
                  </Box>
                  {me ? (
                    <IconButton component={Link} to="/settings">
                      <SettingsIcon />
                    </IconButton>
                  ) : (
                    <Button variant="outlined" size="small" color="primary">
                      Follow
                    </Button>
                  )}
                </>
              )}
            </Stack>
            <Stack
              direction="row"
              alignItems={"center"}
              spacing={2}
              marginBottom={1.5}
            >
              <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                {profile?.followers ? profile.followers.length : 0} followers
              </Typography>
              <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                {profile?.following ? profile.following.length : 0} followers
              </Typography>
            </Stack>
            <Typography variant="caption">
              {profile?.bio ? profile?.bio : <i>404 Bio not found</i>}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <br />
      <br />
      <Divider />

      <CustomTabs
        value={value}
        onChange={handleChange}
        aria-label="Browse profile tabs"
        centered
      >
        <CustomTab
          label={
            <span>
              <ViewModuleIcon
                fontSize="small"
                sx={{ verticalAlign: "-5px", marginRight: 0.5 }}
              />
              Posts
            </span>
          }
          {...tabProps(0)}
        />
        {me && (
          <CustomTab
            label={
              <span>
                <BookmarkIcon
                  fontSize="small"
                  sx={{ verticalAlign: "-5px", marginRight: 0.5 }}
                />
                Saved
              </span>
            }
            {...tabProps(1)}
          />
        )}
      </CustomTabs>
      <Box sx={{ width: "80%", mx: "auto" }}>
        <TabPanel value={value} index={0}>
          <Post fetchQuery={[Query.equal("user_id", userId)]} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Post fetchQuery={[Query.search("saved_by", userId)]} />
        </TabPanel>
      </Box>
    </>
  );
}

export default ProfileHoc(Profile);
