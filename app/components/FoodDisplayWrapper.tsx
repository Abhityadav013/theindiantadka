"use client"; // Add this to mark the component as a Client Component

import { Box, Typography, Grid } from "@mui/material";
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
    const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
    const category = useSelector((state: RootState) => state.category?.category || "All");
    return (
        <Box className="mt-8">
            {
                cart.length > 0 && (
                    <ViewCart itmesCount={cart.length} />
                )
            }
            <Typography variant="h5" component="h2" fontWeight={600} className="text-xl">
                Top dishes near you
            </Typography>
            <Grid container spacing={2} className="mt-8">
                {food_list.map((item) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <MenuFoodItem food_item={item} />
                            </Grid>
                        );
                    }
                    return null;
                })}
            </Grid>
        </Box>
    );
};

export default FoodDisplayWrapper;
