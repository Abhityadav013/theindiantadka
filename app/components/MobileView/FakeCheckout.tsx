import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import FakeCheckOutReturn from "./FakeCheckoutReturnButton";
// import CartNavigate from "./CartNavigate";

const FakeSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className="fixed left-1/2 transform -translate-x-1/2 bg-white text-white p-4 flex flex-col justify-center items-center shadow-lg z-50"
      sx={{
        width: isMobile ? "100%" : "60%",
        height: "100vh", // Cover complete height of the screen
        padding: isMobile ? "8px" : "16px",
        gap: isMobile ? "8px" : "0",
        top: "0%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", // Center the text
      }}
    >
      <Typography variant="body1" className="font-semibold text-3xl text-black">
        Oops! Your cart is empty
      </Typography>
      <Typography variant="body1" className="font-semibold text-sm text-black">
        Please add some items to your cart before proceeding to checkout.
      </Typography>
      <FakeCheckOutReturn />
      {/* <CartNavigate /> */}
    </Box>
  );
};

export default FakeSection;
