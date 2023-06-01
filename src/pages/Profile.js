// react and other modules
import { useState } from "react";
import { Link } from "react-router-dom";

// material ui modules
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// material icons
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// custom modules
import { useAuth } from "../hooks/useAuth";

const imgSrc =
  "https://images.pexels.com/photos/16564742/pexels-photo-16564742/free-photo-of-fashion-man-people-woman.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];

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

export default function Profile({ myProfile }) {
  const [value, setValue] = useState(0);
  const [me] = useState(Boolean(myProfile));
  const [auth] = useAuth();
  // const { userId } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mx: "auto", marginTop: 9 }}>
      <Box sx={{ paddingY: 1 }}>
        <Box sx={{ width: "60%", margin: "auto" }}>
          <Grid container spacing={2}>
            <Grid item sm={12} lg={4}>
              <img
                alt={auth.user.name}
                src={imgSrc}
                className="profile-image"
              />
            </Grid>
            <Grid item sm={12} lg={8}>
              <Stack
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={2}
                sx={{ marginBottom: 1.5 }}
              >
                <Typography variant="subtitle1" textTransform="capitalize">
                  {auth?.user?.name}{" "}
                  {me && (
                    <span
                      style={{
                        textTransform: "none",
                        fontSize: "13px",
                        verticalAlign: "1px",
                      }}
                    >
                      • {auth?.user?.email}
                    </span>
                  )}
                </Typography>
                {me ? (
                  <IconButton component={Link} to="/settings">
                    <SettingsIcon />
                  </IconButton>
                ) : (
                  <Button variant="outlined" size="small" color="primary">
                    Follow
                  </Button>
                )}
              </Stack>
              <Stack
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={2}
                marginBottom={1.5}
              >
                <Typography variant="subtitle1">21 posts</Typography>
                <Typography variant="subtitle1">99 followers</Typography>
                <Typography variant="subtitle1">50 following</Typography>
              </Stack>
              <Typography variant="caption" fontStyle={"italic"}>
                404 Bio not found
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
        </CustomTabs>
        <Box sx={{ width: "80%", mx: "auto" }}>
          <TabPanel value={value} index={0}>
            <ImageList cols={3}>
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ImageList cols={3}>
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
}
