import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/reducers";

interface CartSectionProps {
  title: string;
}

const CartSection: React.FC<CartSectionProps> = ({ title }) => {
  const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <Box
      //ToDo:: need this wehn we have login functionality
      className="absolute pl-14 left-1/2 top-0 transform -translate-x-1/2 bg-white text-white p-4 flex flex-col justify-center items-start"
      //className="absolute pl-28 left-1/2 top-0 transform -translate-x-1/2 bg-white text-white p-4 flex flex-col justify-center items-start"

      sx={{
        width: isMobile ? "100%" : "80%", // Cover complete height of the screen
        padding: isMobile ? "8px" : "8px",
        gap: isMobile ? "8px" : "0",
        top: "0", // Adjust top to 0 to cover the entire viewport height
        textAlign: "center", // Center the text
      }}
    >

      <Typography variant="body1" className="font-semibold text-2xl text-black">
        <IconButton
          edge="start"
          color="default"
          onClick={onBack}
          sx={{ position: "fixed", top: 12, left: 20 }}
        >
          <ArrowBackIcon />
        </IconButton>
        {title}
      </Typography>
    </Box>
  );
};

export default CartSection;
