import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Drawer,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Slide,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage, removeFromLocalStorage } from "./localStorage";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState(getFromLocalStorage("cart") || []);
  const [favorites, setFavorites] = useState(
    getFromLocalStorage("favorites") || []
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    const user = getFromLocalStorage("user");
    if (user) {
      setUserData(user);
    } else {
      setUserData(null);
    }
  }, []);

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleReset = () => {
    setOpenResetDialog(true);
  };

  const confirmLogout = () => {
    removeFromLocalStorage("user");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const confirmReset = () => {
    removeFromLocalStorage("user");
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/register", { replace: true });
    }, 1500);
  };

  const cancelReset = () => {
    setOpenResetDialog(false);
  };

  const handleDrawerToggle = (drawerType) => {
    setActiveDrawer(drawerType === activeDrawer ? null : drawerType);
  };

  const handleQuantityChange = (item, increment) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id
        ? {
            ...cartItem,
            quantity: increment
              ? cartItem.quantity + 1
              : Math.max(cartItem.quantity - 1, 1),
          }
        : cartItem
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between bg-blue-500 text-white">
        <Typography variant="h6">My Store</Typography>
        <div className="flex items-center space-x-4">
          <IconButton onClick={() => setMenuOpen(true)}>
            <AccountCircleIcon />
          </IconButton>
          <IconButton onClick={() => handleDrawerToggle("favorites")}>
            <FavoriteIcon color={favorites.length > 0 ? "error" : "inherit"} />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                {favorites.length}
              </span>
            )}
          </IconButton>
          <IconButton onClick={() => handleDrawerToggle("cart")}>
            <ShoppingCartIcon color={cart.length > 0 ? "primary" : "inherit"} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                {cart.length}
              </span>
            )}
          </IconButton>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div className="p-2">
          <IconButton
            onClick={() => setMenuOpen(false)}
            edge="start"
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="p-6 w-full">
          <Typography variant="h6" className="font-bold text-center mb-4">
            Profile Info
          </Typography>
          {userData ? (
            <>
              <Typography variant="body1">Email: {userData.email}</Typography>
              <Typography variant="body1">
                Password: {userData.password}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">No user data found.</Typography>
          )}
          <div className="flex flex-col items-center mt-4 space-y-2">
            <Button
              variant="contained"
              color="secondary"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="error"
              className="w-full"
              onClick={handleReset}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={activeDrawer === "cart"}
        onClose={() => setActiveDrawer(null)}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div className="p-2">
          <IconButton
            onClick={() => setActiveDrawer(null)}
            edge="start"
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="p-6 w-full">
          <Typography variant="h6" className="font-bold text-center mb-4">
            Cart Items
          </Typography>
          <div>
            {cart.length === 0 ? (
              <Typography>No items in the cart</Typography>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="mb-4 flex items-center space-x-2">
                  <div
                    className="relative w-16 h-16"
                    style={{
                      backgroundColor: "black",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <div>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2">
                      Price: ${item.price}
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outlined"
                        onClick={() => handleQuantityChange(item, false)}
                        disabled={item.quantity === 1}
                      >
                        -
                      </Button>
                      <Typography variant="body2">{item.quantity}</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleQuantityChange(item, true)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <Typography variant="h6" className="font-bold">
              Total Price: ${calculateTotalPrice()}
            </Typography>
          </div>
        </div>
      </Drawer>

      <Dialog open={openLogoutDialog} onClose={cancelLogout}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="secondary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openResetDialog} onClose={cancelReset}>
        <DialogTitle>Are you sure you want to reset your data?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelReset} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmReset} color="secondary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="User data reset successfully"
        autoHideDuration={1500}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
      />
    </div>
  );
};

export default Home;
