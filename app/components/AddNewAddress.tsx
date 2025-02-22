import { IconButton, TextField, Drawer, Typography, Button, Chip } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

interface AddressFormProps {
    onSubmit: (values: AddressInput) => void;
    isOpen: boolean;
    onClose: () => void; // onClose function to close the drawer
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
}
) => {
    const [flatNumber, setFlatNumber] = React.useState("");
    const [buildingNumber, setBuildingNumber] = React.useState("");
    const [street, setStreet] = React.useState("");
    const [pincode, setPincode] = React.useState("");
    const [addressType, setAddressType] = React.useState("")


    const handleSubmit = async () => {
        try {
            await onSubmit({ flatNumber, buildingNumber, street, pincode, addressType }); // Call the passed function for form submission
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <Drawer
            anchor="left"
            open={isOpen}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "100%",
                    maxWidth: "500px",
                    height: "100%",
                },
            }}
        >
            <div className="w-full p-6 rounded-t-xl relative">
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
                        Save delivery address
                    </Typography>
                </div>
                <div className='pl-[160px] pr-[20px]'>
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
                        label="street"
                        variant="outlined"
                        fullWidth
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="pincode"
                        variant="outlined"
                        fullWidth
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="mb-4"
                        required
                    />

                    <div className="flex border-0 mb-4">
                        <Chip
                        icon={<HomeIcon />}
                            label="Home"
                            clickable
                            color={addressType === "Home" ? "primary" : "default"}
                            onClick={() => setAddressType("Home")}
                            variant={addressType === "Home" ? "filled" : "outlined"}
                            style={{
                                borderRadius: 0, // Square edges
                                marginRight: 0, // No space between chips
                            }}
                        />
                        <Chip
                        icon={<WorkIcon />}
                            label="Work"
                            clickable
                            color={addressType === "Work" ? "primary" : "default"}
                            onClick={() => setAddressType("Work")}
                            variant={addressType === "Work" ? "filled" : "outlined"}
                            style={{
                                borderRadius: 0, // Square edges
                                marginRight: 0, // No space between chips
                            }}
                        />
                        <Chip
                        icon={<NotListedLocationIcon />}
                            label="Other"
                            clickable
                            color={addressType === "Other" ? "primary" : "default"}
                            onClick={() => setAddressType("Other")}
                            variant={addressType === "Other" ? "filled" : "outlined"}
                            style={{
                                borderRadius: 0, // Square edges
                                marginRight: 0, // No space between chips
                            }}
                        />
                    </div>
                    <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    className="mb-4 bg-tomato"
                    sx={{
                        height: '46px', // Set the height of the button to match the TextField height
                    }}
                >
                    SAVE ADDRESS & PROCEED
                </Button>

                </div>


           
            </div>
        </Drawer>
    )
}

export default AddNewAddress
