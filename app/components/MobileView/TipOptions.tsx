'use client';
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, InputAdornment } from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const TipOptions = () => {
    const [selectedTip, setSelectedTip] = useState<number | string>();
    const [customTip, setCustomTip] = useState(""); // Stores custom tip value
    const [isMostPopularDisabled, setIsMostPopularDisabled] = useState(false);
    const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);

    const handleTipSelection = (amount: number | string) => {
        if (selectedTip === amount) {
            setSelectedTip(undefined);
            setCustomTip('');
            sessionStorage.removeItem('tipAmount');
            sessionStorage.removeItem('tipType');
            if (amount !== 10) {
                setIsMostPopularDisabled(true);
            } else {
                setIsMostPopularDisabled(false);
            }
        } else {
            setSelectedTip(amount);
            // Reset custom tip when selecting preset values
            if (amount !== "Other") {
                setCustomTip("");
                sessionStorage.removeItem('tipType')
                sessionStorage.setItem('tipAmount', String(amount))
            } else {
                sessionStorage.removeItem('tipAmount')
                sessionStorage.setItem('tipType', 'Other');
            }
        }
    };

    const handleCustomTip = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomTip(event.target.value)
        sessionStorage.setItem('tipAmount', event.target.value);
    }

    useEffect(() => {

        const checkSessionStorage = () => {
            const tipAmount = sessionStorage.getItem('tipAmount');
            const tipType = sessionStorage.getItem('tipType');
            if (tipAmount && tipType !== 'Other') {
                setSelectedTip(Number(tipAmount)); // Sets to preset tip value
                // setIsMostPopularDisabled(true)
            }
            else if (tipAmount) {
                setSelectedTip('Other'); // Sets to "Other"
                setCustomTip(tipAmount || ''); // If there's a stored custom tip, set it
            }
        };

        checkSessionStorage();

        // Set up interval to check sessionStorage every 500ms
        const intervalId = setInterval(checkSessionStorage, 5);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [selectedTip]); // Only run on component mount

    useEffect(() => {
        const checkMostPopular = () => {
            if (selectedTip && selectedTip !== 10) {
                setIsMostPopularDisabled(true)
            } else if (selectedTip !== undefined) {
                setIsMostPopularDisabled(false)
            }
        }
        checkMostPopular()
    }, [selectedTip])

    return (
        <Box className="mt-4 p-3 border rounded-lg bg-white shadow-md">
            <Box className="flex items-center space-x-2">
                <EmojiObjectsIcon className="text-yellow-500" />
                <Typography variant="subtitle1" className="font-semibold">
                    Say thanks with a Tip!
                </Typography>
            </Box>
            <Typography variant="body2" className="text-gray-600 mt-1">
                Our delivery partners bring your favourite meals. Thank them with a tip.
            </Typography>

            {/* Tip Buttons */}
            <Box className={`flex mt-3 ${isMobileView ? 'gap-1' : 'gap-3'} justify-start`}>
                {[5, 10, 20, "Other"].map((amount) => (
                    <Button
                        key={amount}
                        variant="outlined"
                        onClick={() => handleTipSelection(amount)}
                        className={`border-[#ccc]  px-4 py-2 text-black relative ${selectedTip === amount ? "border-orange-500" : ""
                            }`}
                        sx={{
                            maxWidth: "100px",  // Ensure buttons don't shrink too much
                            // whiteSpace: "nowrap", // Prevent text from wrapping
                            // overflow: "hidden",  // Prevent overflow
                            // textOverflow: "ellipsis", // In case of long text
                        }}
                    >
                        €{amount !== "Other" ? amount : "Other"}
                        {selectedTip === amount && selectedTip !== 'Other' && (
                            <CloseIcon className="text-sm text-tomato ml-2" />
                        )}
                        {amount === 10 && !isMostPopularDisabled && (
                            <Box
                                className="absolute mt-7 w-full max-w-3xl bg-orange-500 text-white text-[9px] px-0 py-0 space-x-2"
                                sx={{ borderRadius: 0 }}
                            >
                                Most Tipped
                            </Box>
                        )}
                    </Button>
                ))}
            </Box>

            {/* Show TextField if "Other" is selected */}
            {selectedTip === "Other" && (
                <Box className="mt-3">
                    <TextField
                        type="text"
                        label="Enter Tip Amount"
                        variant="outlined"
                        fullWidth
                        value={customTip}
                        onChange={handleCustomTip}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">€</InputAdornment> // Adds Euro symbol inside input field
                                ),
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default TipOptions;
