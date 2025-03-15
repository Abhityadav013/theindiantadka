import React from "react";
import { Box, Typography } from "@mui/material";
import AddAddressButton from "./AddAddressButton";
// import CartNavigate from "./CartNavigate";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddressForm from "./AddressForm";

interface AddAddressSectionProps{
    isMobile:boolean
}
const AddAddressSection: React.FC<AddAddressSectionProps> = ({isMobile}) => {
    return (
        <Box
            className={
                `fixed left-1/2 bottom-0 transform -translate-x-1/2
                 bg-white text-white p-4 flex flex-col justify-between items-start
                  ${isMobile ? 'shadow-lg z-50' : ""}`}
            sx={{
                width: isMobile ? "100%" : '80%',
                height: "auto",
                padding: "8px",
                gap: "8px"
            }}
        >
            {/* Flex container to align the icon and text in the same row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddLocationAltOutlinedIcon className="text-gray-700" fontSize="medium" />
                <Typography variant="body1" className="font-semibold text-sm text-black">
                Oops! Looks like we don’t have your address yet. Can you add it?
                </Typography>
            </Box>

            <AddAddressButton />
            <AddressForm />
            {/* <CartNavigate /> */}
        </Box>
    );
};

export default AddAddressSection;
