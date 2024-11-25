// components/Favorites.js
import React from "react";
import { Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { saveToLocalStorage } from "../localStorage"; // Utility for saving to localStorage

const Favorites = ({ favorites, setFavorites }) => {
  // Handle adding/removing from favorites
  const handleAddToFavorites = (item) => {
    const updatedFavorites = [...favorites];
    const existingFavoriteIndex = updatedFavorites.findIndex(
      (fav) => fav.id === item.id
    );

    if (existingFavoriteIndex === -1) {
      updatedFavorites.push(item);
    } else {
      updatedFavorites.splice(existingFavoriteIndex, 1); // Remove item if it's already in favorites
    }

    setFavorites(updatedFavorites);
    saveToLocalStorage("favorites", updatedFavorites);
  };

  return (
    <div className="flex items-center space-x-4">
      {favorites.map((item) => (
        <Button
          key={item.id}
          onClick={() => handleAddToFavorites(item)}
          color="error"
        >
          <FavoriteIcon />
        </Button>
      ))}
    </div>
  );
};

export default Favorites;
