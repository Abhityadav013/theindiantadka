import { IconButton, TextField, Drawer, Typography, Button, Chip, RadioGroup, FormHelperText, FormControlLabel, Radio, FormControl, Autocomplete } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { Address } from '../utils/types/address_type';
import PhoneInput from 'react-phone-input-2';
import { OrderType } from '../models/Order';
import { ErrorResponse } from './Navbar';
import { CustomerOrder } from '../utils/types/customer_details_type';
import { fetchPlaceByPostalCode, fetchStreetsByPostalCode } from '../redux/sagas/commonAPIs';
import { PostCodePlace } from '../utils/types/location_type';


interface AddressFormProps {
    onSubmit: (values: { userInfo: UserInfo, orderType: OrderType, address?: AddressInput }) => void;
    isOpen: boolean;
    onClose: () => void; // onClose function to close the drawer
    address: Address,
    isMobile: boolean,
    error: ErrorResponse | null;
    setFormError: (values: ErrorResponse) => void
    formValues: CustomerOrder;
}

export interface AddressInput {
    buildingNumber: string
    street: string;
    town: string;
    pincode: string;
    addressType: string


}
export interface UserInfo {
    name: string;
    phoneNumber: string
}



const AddNewAddress: React.FC<AddressFormProps> = ({
    onSubmit,
    isOpen,
    onClose,
    address,
    isMobile,
    error,
    setFormError,
    formValues,
}

) => {
    const [name, setUserName] = React.useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>(""); // Phone number for sign-up
    const [buildingNumber, setBuildingNumber] = React.useState("");
    const [street, setStreet] = React.useState<string>("");
    const [town, setTown] = React.useState("");
    const [pincode, setPincode] = React.useState<string>("");
    const [addressType, setAddressType] = React.useState("");
    const [orderType, setOrderType] = React.useState<OrderType>(OrderType.DELIVERY);
    const [currentFormError, setCurrentFormError] = React.useState<ErrorResponse>([]);
    const [streetOptions, setStreetOptions] = useState<string[]>([]);

    useEffect(() => {
        const hasCustomerDetails =
            formValues.customerDetails &&
            Object.keys(formValues.customerDetails).length > 0;
    
        if (hasCustomerDetails) {
            const customer = formValues.customerDetails;
            setUserName(customer.name || "");
            setPhoneNumber(customer.phoneNumber || "");
            if (customer.address && Object.keys(customer.address).length > 0) {
                setTown(customer.address.town || "");
                setBuildingNumber(customer.address.buildingNumber || "");
                setStreet(customer.address.street || "");
                setPincode(customer.address.pincode || "");
                setAddressType(customer.address.addressType?.toLowerCase() || "home");
            }
            setOrderType(formValues.orderType || OrderType.DELIVERY);
        } else if (address) {
            setStreet(address.road || "");
            setPincode(address.postcode || "");
            setBuildingNumber(address.house_number || "");
            setTown(
                address.city ||
                address.town ||
                address.city_district ||
                address.village ||
                ""
            );
        }
    }, [formValues, address]);
    

    const handlePostalCodeChange = async (value: string): Promise<void> => {
        setPincode(value);
        if (value.length === 5) {
            const pinCodeArea: PostCodePlace[] = await fetchPlaceByPostalCode(value); // Fetch place and streets when postal code is complete
            if (pinCodeArea && pinCodeArea.length > 0) {
                //             setTown(formValues.customerDetails.address.town || "");
                setTown(pinCodeArea[0]['place name'] || "")
                const streets = await fetchStreetsByPostalCode(value)
                setStreetOptions(streets);
                setCurrentFormError((prev) => prev.filter((error) => error.key !== 'pincode'));
            } else {
                setTown("")
                setStreetOptions([]);
                setCurrentFormError([{ key: 'pincode', message: 'Inavlid pincode. Please enter correct pincode' }])
            }
        }
    };

    useEffect(() => {

    }, [currentFormError])


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            if (orderType === OrderType.DELIVERY) {
                console.log(" addressType.toUpperCase()", addressType.toUpperCase())
                await onSubmit({
                    userInfo: { name, phoneNumber },
                    orderType: orderType,
                    address: { buildingNumber, street, town, pincode, addressType: addressType.toUpperCase() },

                });
            } else {
                await onSubmit({
                    userInfo: { name, phoneNumber },
                    orderType: orderType,
                });
            }
            // Call the passed function for form submission
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleOrderTypeMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrderType(event.target.value as OrderType);
    };


    const getErrorMessage = (key: string) => {
        if (error && error.length == 0) {
            return currentFormError?.find((err) => err.key === key)?.message || null;
        }
        else {
            return error?.find((err) => err.key === key)?.message || null;
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
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="payment-method"
                            value={orderType}
                            onChange={handleOrderTypeMethodChange}
                            row
                        >
                            <FormControlLabel
                                value="PICKUP"
                                control={<Radio />}
                                label="Pickup Order"
                            />
                            <FormControlLabel
                                value="DELIVERY"
                                control={<Radio />}
                                label="Delivery"
                            />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mb-4"
                        required
                        error={!!getErrorMessage('name')}
                        helperText={getErrorMessage('name')}
                    />

                    <div className="mb-4">
                        <PhoneInput
                            country={"de"} // Default country set to Germany
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            preferredCountries={["de"]} // Always show Germany at the top
                            enableSearch={true} // Allow searching for country codes
                            disableSearchIcon={false} // Show a search icon
                            autoFormat={true} // Auto-format the input for better UX
                            priority={{ de: 1 }} // Ensures 'DE' stays at the top of the list when opening
                            inputStyle={{
                                width: "100%",
                                height: "56px",
                                fontSize: "16px",
                                paddingLeft: "50px", // Adjust space for flag & country code
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            buttonStyle={{
                                background: "transparent",
                            }}
                            dropdownStyle={{
                                maxHeight: "250px", // Limit height to prevent excessive scrolling
                                overflowY: "auto", // Enable scrolling
                                zIndex: 1000, // Ensure it's above other elements
                            }}
                            searchStyle={{
                                width: "90%",
                                margin: "10px auto",
                                padding: "8px",
                                fontSize: "14px",
                                borderRadius: "6px",
                            }}
                        />
                        {getErrorMessage('phoneNumber') && (
                            <FormHelperText error>
                                {getErrorMessage("phoneNumber")}
                            </FormHelperText>
                        )}
                    </div>
                    {
                        orderType === OrderType.DELIVERY && (
                            <>
                                <TextField
                                    label="Pincode"
                                    variant="outlined"
                                    fullWidth
                                    value={pincode}
                                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                                    className="mb-4"
                                    required
                                    error={!!getErrorMessage("pincode")}
                                    helperText={getErrorMessage("pincode")} // Show error for email
                                />
                                <TextField
                                    label="Building No."
                                    variant="outlined"
                                    fullWidth
                                    value={buildingNumber}
                                    onChange={(e) => setBuildingNumber(e.target.value)}
                                    className="mb-4"
                                    required
                                    error={!!getErrorMessage("buildingNumber")}
                                    helperText={getErrorMessage("buildingNumber")} // Show error for email
                                />
                                <Autocomplete
                                    freeSolo
                                    options={streetOptions}
                                    inputValue={street}
                                    onInputChange={(event, newInputValue) => setStreet(newInputValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Street"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={!!getErrorMessage("street")}
                                            helperText={getErrorMessage("street")}
                                            className="mb-4"
                                        />
                                    )}
                                />
                                <TextField
                                    label="City or Town"
                                    variant="outlined"
                                    fullWidth
                                    value={town}
                                    onChange={(e) => setTown(e.target.value)}
                                    className="mb-4"
                                    required
                                    error={!!getErrorMessage("town")}
                                    helperText={getErrorMessage("town")} // Show error for email
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
                            </>
                        )
                    }

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={(event) => { handleSubmit(event); setFormError([]) }}
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
