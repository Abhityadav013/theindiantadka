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
    >
      {menu_list?.map((item, index) => (
        <Box
          key={index}
          className={`cursor-pointer flex flex-col items-center justify-center text-center border-2 rounded-full p-1 transition-colors duration-200 ${category === item.menu_name ? "border-[tomato]" : "border-transparent"
            }`}
          onClick={() =>
            setFoodCategory((prev) => ({
              category: prev.category === item.menu_name ? "All" : item.menu_name,
            }))
          }
        >
          {/* Image container with responsive size */}
          <Box
            className="relative overflow-hidden rounded-full w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] md:w-[128px] md:h-[128px]"
          >
            <Image
              className="object-cover transition-all"
              src={item.menu_image}
              alt={item.menu_name}
              fill
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </Box>

          {/* Menu Name */}
          <Typography
            variant="body2"
            color="text.secondary"
            className="mt-3 text-[0.6rem] sm:text-xs md:text-sm text-center break-words max-w-[100px]"
          >
            {item.menu_name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ExploreMenuCategory;
