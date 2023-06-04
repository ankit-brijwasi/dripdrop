import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading({ message, style }) {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
        ...style,
      }}
    >
      <CircularProgress color="primary" sx={{ marginBottom: 0.6 }} />
      {message ? message : "loading..."}
    </Box>
  );
}
