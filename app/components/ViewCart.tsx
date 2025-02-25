import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import CartNavigate from "./CartNavigate";

interface ViewCartProps {
  itmesCount: number;
}

const ViewCart: React.FC<ViewCartProps> = ({ itmesCount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className="fixed left-1/2 bottom-0 transform -translate-x-1/2 bg-green-600 text-white p-4 flex justify-between items-center shadow-lg z-50"
      sx={{
        width: isMobile ? "100%" : "60%",
        height: isMobile ? "auto" : "auto",
        padding: isMobile ? "8px" : "16px",
        gap: isMobile ? "8px" : "0",
      }}
    >
      <Typography variant="body1" className="ml-4 font-semibold">
        {itmesCount} item{itmesCount > 1 ? "s" : ""} added
      </Typography>
      <CartNavigate />
    </Box>
  );
};

export default ViewCart;
