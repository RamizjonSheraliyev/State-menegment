// components/Cart.js
import React from "react";
import { Button, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { saveToLocalStorage } from "../localStorage"; // Utility for saving to localStorage

const Cart = ({ cart, setCart, totalPrice, setTotalPrice }) => {
  // Handle item quantity change
  const handleChangeQuantity = (id, change) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const updatedItem = updatedCart[itemIndex];
      const newQuantity = updatedItem.quantity + change;
      if (newQuantity >= 1) {
        updatedItem.quantity = newQuantity;
      }
    }

    setCart(updatedCart);
    saveToLocalStorage("cart", updatedCart);
  };

  // Handle item removal
  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveToLocalStorage("cart", updatedCart);
  };

  return (
    <div className="p-4">
      <Typography variant="h6">Shopping Cart</Typography>
      <div className="mt-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            {/* Body section for image */}
            <div className="flex items-center space-x-4">
              <div className="w-full flex justify-center">
                <img
                  src={`https://via.placeholder.com/100x100?text=Image+${item.id}`}
                  alt={`Item ${item.id}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={() => handleChangeQuantity(item.id, -1)}>
                -
              </Button>
              <Typography>{item.quantity}</Typography>
              <Button onClick={() => handleChangeQuantity(item.id, 1)}>
                +
              </Button>
            </div>
            <Typography>${item.price * item.quantity}</Typography>
            <Button onClick={() => handleRemoveFromCart(item.id)}>
              <CloseIcon />
            </Button>
          </div>
        ))}
        <Typography className="mt-4 font-bold">Total: ${totalPrice}</Typography>
      </div>
    </div>
  );
};

export default Cart;
