// react modules
import { ID } from "appwrite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// material ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { alpha } from "@mui/material/styles";

// third party modules
import { toast } from "react-toastify";

// custom modules and components
import { account, databases } from "../appwrite/config";
import { useAuth } from "../hooks/useAuth";
import Link from "../components/Link";
import { isUserNameTaken } from "../utils/helpers";

function Signup(params) {
  const [bio, setBio] = useState(
    "Hey there👋! My name is Jhon and I am here to explore😄"
  );
  const [name, setName] = useState("Jhon Doe");
  const [username, setUsername] = useState("jhon.doe");
  const [email, setEmail] = useState("jhon.doe@dripdrop.com");
  const [password, setPassword] = useState("TestUser123");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();
  const [auth] = useAuth();

  useEffect(() => {
    if (auth.authenticated) navigate("/");
  }, [auth, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (await isUserNameTaken(username)) {
        toast("Username is already taken", { type: "error" });
        setLoading(false);
        return;
      }
      const user = await account.create(ID.unique(), email, password, name);
      await databases.createDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_PROFILE_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          username: username,
          bio: bio,
        }
      );
      toast("Thank you for registering at dripdrop!😇", { type: "success" });
      navigate("/accounts/signin");
    } catch (error) {
      if (error.code >= 400) toast(error.response.message, { type: "error" });
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    let timeoutId;
    const verifyUsername = async () => {
      const isTaken = await isUserNameTaken(username);
      setValidationError(isTaken);
      setSearching(false);
    };

    if (username) {
      setSearching(true);
      setTimeout(verifyUsername, 500);
    }

    return () => {
      if (timeoutId) clearInterval(timeoutId);
    };
  }, [username]);

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
            DripDrop Signup
          </Typography>
          <br />
          <TextField
            label="Name"
            type="text"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            required
            autoFocus
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Username"
            type="text"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            error={validationError}
            helperText={validationError && "Username is already taken!"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searching && (
                    <CircularProgress
                      style={{ width: "20px", height: "20px" }}
                      disableShrink
                    />
                  )}
                </InputAdornment>
              ),
            }}
            required
            fullWidth
          />
          <br />
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
            fullWidth
          />
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
          <TextField
            label="Bio"
            type="text"
            variant="standard"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            rows={2}
            multiline
            fullWidth
          />
          <br />
          <br />
          <Button
            disabled={loading || validationError}
            variant="contained"
            type="submit"
            fullWidth
          >
            Signup
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
              Already registered? <Link href="/accounts/signin/">Sign in</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Paper>
  );
}

export default Signup;
