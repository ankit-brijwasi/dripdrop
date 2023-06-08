// react modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// material ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { alpha } from "@mui/material/styles";

// third party modules
import { toast } from "react-toastify";

// custom modules and components
import { account } from "../appwrite/config";
import { useAuth } from "../hooks/useAuth";
import Link from "../components/Link";
import { getProfileFromUserId } from "../utils/helpers";

function Login(params) {
  const [email, setEmail] = useState("user1@dripdrop.com");
  const [password, setPassword] = useState("TestUser123");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [auth, dispatch] = useAuth();

  useEffect(() => {
    if (auth?.user) navigate("/");
  }, [auth, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      const profile = await getProfileFromUserId(user.$id);
      dispatch({ type: "signin", user: { ...user, profile }, error: null });
    } catch (error) {
      if (error.code >= 400) toast(error.response.message, { type: "error" });
    }
    setLoading(false);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        maxWidth: "550px",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box p={4}>
        <form method="post" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" mb={2}>
            DripDrop Login
          </Typography>
          <br />
          <TextField
            label="Email"
            type="email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            required
            autoFocus
            fullWidth
          />
          <br />
          <br />
          <br />
          <TextField
            label="Password"
            type="password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            required
            fullWidth
          />
          <br />
          <br />
          <Link
            href="/accounts/signup/"
            sx={{ textAlign: "right", display: "block" }}
          >
            Forgot Password?
          </Link>
          <br />
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            fullWidth
          >
            Login
          </Button>
          <br />
          <br />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: (theme) => alpha(theme.palette.common.white, 0.8),
              }}
            >
              Not registered yet? <Link href="/accounts/signup/">Sign up</Link>{" "}
              here.
            </Typography>
          </Box>
        </form>
      </Box>
    </Paper>
  );
}

export default Login;
