import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import LoginButton from "./LoginButton";
// import CartNavigate from "./CartNavigate";

const LoginSection: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            className="fixed left-1/2 bottom-0 transform -translate-x-1/2 bg-white text-white p-4 flex flex-col justify-between items-start shadow-lg z-50"
            sx={{
                width: isMobile ? "100%" : "60%",
                height: isMobile ? "auto" : "auto",
                padding: isMobile ? "8px" : "16px",
                gap: isMobile ? "8px" : "0",
            }}
        >
            <Typography variant="body1" className="font-semibold text-xl text-black">
                Almost There
            </Typography>
            <Typography variant="body1" className="font-semibold text-sm text-black">
                Login or Sign Up to place your order
            </Typography>
            <LoginButton />
            {/* <CartNavigate /> */}
        </Box>
    );
};

export default LoginSection;
