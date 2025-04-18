import React from "react";
import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        height: { xs: "50vw", sm: "40vw", md: "34vw" },  // Adjust height based on screen size
        mx: "auto",
        mt: { xs: "30%", sm: "10%" }, // Adjust margin top for smaller screens
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
            fontSize: { xs: "max(5vw,12px)", sm: "max(4.5vw,22px)" }, // Responsive font size
            whiteSpace: "normal", // Prevent text from overflowing
            padding:{xs: "5px"},
            marginBottom:{xs:"10px"}
          }}
        >
          Order your favourite food here
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
