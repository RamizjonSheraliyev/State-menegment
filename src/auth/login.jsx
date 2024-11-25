import React, { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../components/localStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  const users = getFromLocalStorage("users") || [];

  const handleSubmit = () => {
    const storedUser = users.find((user) => user.email === email);

    if (storedUser && storedUser.password === password) {
      console.log("Login Successful: ", storedUser);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 1500);
    } else {
      console.log("Login Failed: Invalid email or password");
      setError("Invalid email or password");

      if (!storedUser) {
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate("/register");
        }, 3000);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="text-center mb-6 font-bold">
          Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          className="mt-6"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleAlertClose} variant="filled">
          No user registered with this email. Redirecting to Register...
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
