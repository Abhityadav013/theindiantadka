"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ExploreMenuProps } from "./ExploreMenuWrapper";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { AppDispatch } from "../redux/store";
import { fetchCategorySuccess } from "../redux/reducers/categoryReducer";

const ExploreMenuCategory: React.FC<ExploreMenuProps> = ({ menu_list }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { category } = useSelector((state: RootState) => state.category);
  const [foodcategory, setFoodCategory] = useState<{ category: string }>({ category: category });

  useEffect(() => {
    dispatch(fetchCategorySuccess(foodcategory));
  }, [foodcategory, dispatch]);

  return (
    <Box
      className="flex overflow-x-auto gap-3 pb-3 hide-scrollbar"
      sx={{
        "::-webkit-scrollbar": {
          display: "none", // Hide the scrollbar for webkit browsers
        },
        scrollbarWidth: "none", // Hide the scrollbar for Firefox
      }}
    >
      {menu_list?.map((item, index) => {
        return (
          <Box
            key={index}
            className="cursor-pointer flex flex-col items-center justify-center text-center"
            onClick={() =>
              setFoodCategory((prev) => ({
                category: prev.category === item.menu_name ? "All" : item.menu_name,
              }))
            }
          >
            <Box
              className="relative w-[128px] h-[128px] overflow-hidden rounded-full"
            >
              <Image
                className="object-cover transition-all"
                src={item.menu_image}
                alt={item.menu_name}
                fill={true}
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" className="mt-2">
              {item.menu_name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ExploreMenuCategory;
