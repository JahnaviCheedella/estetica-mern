import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import {
  setUsername,
  setPassword,
  resetAuth,
  userAuth,
  loginSuccess, 
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mode, setMode] = useState("signin");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, password, status, error, message, isLoggedIn } =
    useSelector((state) => state.auth);

  const switchMode = (m) => {
    dispatch(resetAuth());
    setMode(m);
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill required fields");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords must match");
      return;
    }

    dispatch(userAuth({ username, password, mode }));
  };

  useEffect(() => {
    if (status === "succeeded" && message) {
      if (mode === "signup") {
        switchMode("signin"); 
      } else if (mode === "signin") {
        dispatch(loginSuccess()); 
        navigate("/home", { replace: true });
      }
    }
  }, [status, message, mode, navigate, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
        p: 2,
      }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 5, lg: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0px 8px 30px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Box component="img" src={logo} alt="Logo" />

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#6C5DD3" }}
            gutterBottom
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            {mode === "signin"
              ? "Please sign in to continue"
              : "Create your account"}
          </Typography>

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
              size="small"
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              size="small"
              fullWidth
              variant="outlined"
            />

            {mode === "signup" && (
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
              />
            )}

            {status === "loading" && (
              <CircularProgress size={24} sx={{ mx: "auto" }} />
            )}

            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ textAlign: "left" }}
              >
                {error}
              </Typography>
            )}

            {message && (
              <Typography
                variant="body2"
                color="success.main"
                sx={{ textAlign: "left" }}
              >
                {message}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={status === "loading"}
              sx={{
                mt: 1,
                py: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
              }}
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>

            <Button
              size="small"
              onClick={() =>
                switchMode(mode === "signin" ? "signup" : "signin")
              }
              sx={{ textTransform: "none", color: "#000" }}
            >
              {mode === "signin"
                ? "New here? Create an account"
                : "Already have an account? Sign In"}
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
