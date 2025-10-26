import React, { useState } from "react";
import { Box, TextField, Button, Typography, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { useUI } from "@hooks/useUI";
import api from "@api/axiox";

export default function RegisterForm() {
  const auth = useAuth();
  const { showLoader, hideLoader, showSnackbar } = useUI();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    phone_number: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const response = await api.post(`auth/users`, form);
      showSnackbar("Registration successful!", "success");
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed. Please try again.";
      showSnackbar(message, "error");
    } finally {
      hideLoader();
    }
  };

  return (
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
          name="email"
          label="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          required
        />
      </FormControl>


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
          name="phone_number"
          label="Phone Number"
          variant="outlined"
          value={form.phone_number}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl>
        <TextField
          name="address"
          label="address"
          variant="outlined"
          value={form.address}
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
        Register
      </Button>
    </Box>
  );
}
