import React from "react";
import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        height: { xs: "50vw", sm: "40vw", md: "34vw" },  // Adjust height based on screen size
        mx: "auto",
        mt: { xs: "15px", sm: "30px" }, // Adjust margin top for smaller screens
        position: "relative",
        backgroundImage: "url('https://testing.indiantadka.eu/assets/header_img.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center", // Center the background image
      }}
    >
      {/* Content Section */}
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: { xs: "3vw", sm: "1.5vw" },  // Adjust gap for smaller screens
          maxWidth: { xs: "65%", sm: "50%" }, // Increase max-width for smaller screens
          bottom: "10%",
          left: { xs: "5%", sm: "6vw" }, // Adjust left position for smaller screens
          animation: "fadeIn 3s",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: "500",
            fontSize: { xs: "max(6vw,16px)", sm: "max(4.5vw,22px)" }, // Responsive font size
            whiteSpace: "normal", // Prevent text from overflowing
            padding:{xs: "5px"},
            marginBottom:{xs:"10px"}
          }}
        >
          Order your favourite food here
        </Typography>

        {/* Description */}
        {/* <Typography
          className="text-xs sm:text-sm mt-1"
          color="white"
          variant="body2"
          sx={{
            display: { xs: "none", sm: "block" },  // Hide on mobile
            whiteSpace: "normal", // Ensure text wraps and doesn't overflow
          }}
        >
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
          Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
        </Typography> */}
      </Box>
    </Box>
  );
};

export default Header;
