import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";

export default function AdminLayout() {
  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Button component={Link} to="/admin" color="inherit">
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
