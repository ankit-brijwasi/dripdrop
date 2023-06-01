import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

function Link({ href, sx, children, variant="body2" }) {
  return (
    <MuiLink
      component={RouterLink}
      sx={{
        color: (theme) => theme.palette.primary.light,
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        ...sx,
      }}
      to={href}
      variant={variant}
    >
      {children}
    </MuiLink>
  );
}

export default Link;
