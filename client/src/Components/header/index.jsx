import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { changeHeaderSearchItem } from "../../redux/slices/headerSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { headerSearchItem } = useSelector((state) => state.header);
  const { username } = useSelector((state) => state.auth);

  const handleHeaderChangeSearchItem = (e) => {
    dispatch(changeHeaderSearchItem(e.target.value));
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#fff", color: "#000", width: "100%" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "120px",
                height: "52px",
                display: { xs: "none", md: "flex" },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                fontWeight: "600",
                display: { xs: "none", md: "block" },
              }}
            >
              Welcome Back, {username} <br />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#64748B",
                }}
              >
                Hello, here you can manage your orders by Zone
              </span>
            </Typography>

            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "100px",
                height: "40px",
                display: { xs: "flex", md: "none" },
              }}
            />

            <Grid sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <TextField
                id="search-bar"
                variant="outlined"
                size="small"
                value={headerSearchItem}
                onChange={handleHeaderChangeSearchItem}
                placeholder="Search..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "10px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#64748B",
                      borderWidth: "1px",
                    },
                  },
                }}
              />

              <Button
                size="small"
                sx={{
                  minWidth: "40px",
                  borderRadius: "50px",
                }}
              >
                <Badge
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#F97415",
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ color: "#020817" }} />
                </Badge>
              </Button>

              <Tooltip title={username}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                >
                  <Avatar sx={{ backgroundColor: "#F1F5F9", color: "#020817" }}>
                    {username ? (
                      username.charAt(0).toUpperCase()
                    ) : (
                      <Person2Icon />
                    )}
                  </Avatar>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#020817",
                      display: { xs: "none", md: "flex" },
                    }}
                  >
                    Profile
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Logout">
                <IconButton
                  size="small"
                  sx={{
                    background: "#6C5DD3",
                    background:
                      "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
                    color: "white",
                    borderRadius: "50px",
                    height: "40px",
                  }}
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login", { replace: true });
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}
export default Header;
