import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../components/localStorage";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const clearUserData = () => {
    removeFromLocalStorage("users");
    console.log("User data has been reset.");

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const users = getFromLocalStorage("users") || [];

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePassword = (password) => /^[0-9]{8,}$/.test(password);

  const isEmailUsed = (email) => users.some((user) => user.email === email);

  const handleValidation = (field, value) => {
    const newErrors = { ...errors };

    if (field === "email") {
      if (!validateEmail(value)) {
        newErrors.email = "Email must end with @gmail.com";
      } else if (isEmailUsed(value)) {
        newErrors.email = "This email is already registered.";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      if (!validatePassword(value)) {
        newErrors.password = "Password must be at least 8 numeric characters.";
      } else {
        delete newErrors.password;
      }

      if (confirmPassword && value !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "confirmPassword") {
      if (value !== password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = () => {
    if (
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword &&
      !isEmailUsed(email)
    ) {
      setLoading(true);
      const updatedUsers = [...users, { email, password }];
      saveToLocalStorage("users", updatedUsers);
      console.log("New User Registered: ", { email, password });
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1500);
    } else {
      if (isEmailUsed(email)) {
        setAlertMessage(
          "This email is already registered. Redirecting to Login..."
        );
        setAlertOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    if (email && isEmailUsed(email)) {
      setAlertMessage("This email is already registered.");
      setAlertOpen(true);
    }
  }, [email]);

  const getPasswordStrength = (password) => {
    if (password.length >= 8 && password.length <= 10) return "weak";
    if (password.length > 10 && password.length <= 15) return "medium";
    if (password.length > 15) return "strong";
    return "none";
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case "weak":
        return "red";
      case "medium":
        return "orange";
      case "strong":
        return "green";
      default:
        return "gray";
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="text-center mb-6 font-bold">
          Register
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleValidation("email", e.target.value);
          }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleValidation("password", e.target.value);
          }}
          error={!!errors.password}
          helperText={errors.password}
        />
        <div className="my-2">
          <Typography
            variant="body2"
            className="mb-1"
            style={{ color: getStrengthColor(passwordStrength) }}
          >
            {passwordStrength === "weak"
              ? "Weak Password"
              : passwordStrength === "medium"
              ? "Medium Password"
              : passwordStrength === "strong"
              ? "Strong Password"
              : ""}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              passwordStrength === "weak"
                ? 33
                : passwordStrength === "medium"
                ? 66
                : passwordStrength === "strong"
                ? 100
                : 0
            }
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "#e0e0e0",
            }}
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: getStrengthColor(passwordStrength),
              },
            }}
          />
        </div>
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            handleValidation("confirmPassword", e.target.value);
          }}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={
            !email ||
            !password ||
            !confirmPassword ||
            Object.keys(errors).length > 0 ||
            isEmailUsed(email)
          }
          onClick={handleSubmit}
          className="mt-6"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Register"
          )}
        </Button>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleAlertClose} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
