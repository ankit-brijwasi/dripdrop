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
import { DialogProvider } from "./context/dialogContext";

// pages
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

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
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
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
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </DialogProvider>
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
