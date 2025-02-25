"use client"; // Add this to mark the component as a Client Component

import { Box, Typography, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { FoodItem } from "../utils/types/menu_type";
import MenuFoodItem from "./MenuFoodItem";
import ViewCart from "./ViewCart";
import { Cart } from "../utils/types/cart_type";

export interface FoodDisplayProps {
  food_list: FoodItem[];
}

const FoodDisplayWrapper: React.FC<FoodDisplayProps> = ({ food_list }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const category = useSelector((state: RootState) => state.category?.category || "All");

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredFoodList = food_list.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearchTerm = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <Box className="mt-8">
      {cart.length > 0 && <ViewCart itmesCount={cart.length} />}
      <Typography variant="h5" component="h2" fontWeight={600} className="text-xl">
        Top dishes near you
      </Typography>
      {isMobile && (
        <Box className="mt-4">
          <TextField
            label="Search Food"
            variant="outlined"
            placeholder="Search for your favorite dish..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
        </Box>
      )}
      <Box className="flex gap-4 mt-4">
        {!isMobile && (
          <TextField
            label="Search Food"
            variant="outlined"
            placeholder="Search for your favorite dish..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
        )}
        {/* <CategoryFilter /> */}
      </Box>
      <Grid container spacing={2} className="mt-8">
        {filteredFoodList.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <MenuFoodItem food_item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FoodDisplayWrapper;
