import React, { useState } from "react";
import { Box, TextField, Button, Typography, FormControl,

      Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
 } from "@mui/material";
import api from "@api/axiox";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("auth/login", form);
      showSnackbar("Login successful!", "success");
      // Handle successful login (e.g., store token, redirect)
      navigate("/")
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
      // insert $q.loading.hide() equivalent here
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "auto",
          mt: 5,
        }}
      >
        <Typography variant="h5">Login</Typography>

        <FormControl>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            value={form.username}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl>
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={form.password}
            onChange={handleChange}
            required
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
