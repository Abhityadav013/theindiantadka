import { IconButton, TextField, Drawer, Typography, Button, Chip } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { Address } from '../utils/types/address_type';


interface AddressFormProps {
    onSubmit: (values: AddressInput) => void;
    isOpen: boolean;
    onClose: () => void; // onClose function to close the drawer
    address: Address,
    isMobile: boolean
}

export interface AddressInput {
    flatNumber: string;
    buildingNumber: string
    street: string;
    pincode: string;
    addressType: string

}


const AddNewAddress: React.FC<AddressFormProps> = ({
    onSubmit,
    isOpen,
    onClose,
    address,
    isMobile
}

) => {
    const [flatNumber, setFlatNumber] = React.useState("");
    const [buildingNumber, setBuildingNumber] = React.useState("");
    const [street, setStreet] = React.useState<string>("");
    const [pincode, setPincode] = React.useState<string>("");
    const [addressType, setAddressType] = React.useState("")

    React.useEffect(() => {
        if (address) {
            setStreet(address.road || "");
            setPincode(address.postcode || "");
            setBuildingNumber(address.house_number || "")
        }
    }, [address]);

    const handleSubmit = async () => {
        try {
            await onSubmit({ flatNumber, buildingNumber, street, pincode, addressType }); // Call the passed function for form submission
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <Drawer
            anchor={isMobile ? "bottom" : "left"}
            open={isOpen}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "100%",
                    maxWidth: "500px",
                    height: "100%",
                    padding: isMobile ? "16px" : "32px", // Adjust padding based on screen size
                    // borderRadius: isMobile ? "20px" : "30px", // Add rounded corners on mobile
                },
            }}
        >
            <div className="w-full p-6 relative">
                {/* Close button */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    sx={{ position: "absolute", top: 10, left: 10 }}
                >
                    <CloseIcon />
                </IconButton>

                <div className="text-center mb-6">
                    <Typography variant="h5" className="text-xl text-black font-semibold">
                        Save Delivery Address
                    </Typography>
                </div>

                {/* Input fields */}
                <div className={isMobile ? 'pl-4 pr-4' : 'pl-12 pr-12'}>
                    <TextField
                        label="Flat No."
                        variant="outlined"
                        fullWidth
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Building No."
                        variant="outlined"
                        fullWidth
                        value={buildingNumber}
                        onChange={(e) => setBuildingNumber(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Street"
                        variant="outlined"
                        fullWidth
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Pincode"
                        variant="outlined"
                        fullWidth
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="mb-4"
                        required
                    />

                    {/* Address Type Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Chip
                            icon={<HomeIcon />}
                            label="Home"
                            clickable
                            color={addressType === "home" ? "primary" : "default"}
                            onClick={() => setAddressType("home")}
                            variant={addressType === "home" ? "filled" : "outlined"}
                        />
                        <Chip
                            icon={<WorkIcon />}
                            label="Work"
                            clickable
                            color={addressType === "work" ? "primary" : "default"}
                            onClick={() => setAddressType("work")}
                            variant={addressType === "work" ? "filled" : "outlined"}
                        />
                        <Chip
                            icon={<NotListedLocationIcon />}
                            label="Other"
                            clickable
                            color={addressType === "other" ? "primary" : "default"}
                            onClick={() => setAddressType("other")}
                            variant={addressType === "other" ? "filled" : "outlined"}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            height: '46px',
                        }}
                    >
                        SAVE ADDRESS & PROCEED
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}

export default AddNewAddress
