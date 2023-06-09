// react and react router dom modules
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// material ui modules
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// other third party packages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import Layout from "./components/Layout";
import ChatLayout from "./components/chat/ChatLayout";
import ChatIndex from "./components/chat/Index";

// context
import { AuthProvider } from "./context/authContext";
import { CommentProvider } from "./context/commentContext";
import { DialogProvider } from "./context/dialogContext";
import { FollowProvider } from "./context/followContext";
import { NewChatProvider } from "./context/newChatContext";

// pages
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Signup from "./pages/Signup";

// css
import "./index.css";

// App component: Contains all the routes
function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#0099cc" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NewChatProvider>
          <Router>
            <FollowProvider>
              <CommentProvider>
                <DialogProvider>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route
                        path="/accounts/me"
                        element={<Profile myProfile={true} />}
                      />
                      <Route path="/settings" element={<Setting />} />
                      <Route path="/chats" element={<ChatLayout />}>
                        <Route index element={<ChatIndex />} />
                        <Route path=":userId" element={<Chat />} />
                      </Route>
                      <Route path="/:userId" element={<Profile />} />
                    </Route>
                    <Route path="/accounts/signin" element={<Login />} />
                    <Route path="/accounts/signup" element={<Signup />} />
                    {/* <Route path="*" element={<NotFound />} /> */}
                  </Routes>
                </DialogProvider>
              </CommentProvider>
            </FollowProvider>
          </Router>
          <ToastContainer />
        </NewChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
