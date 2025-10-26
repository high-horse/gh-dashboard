import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <Typography variant="h3" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
