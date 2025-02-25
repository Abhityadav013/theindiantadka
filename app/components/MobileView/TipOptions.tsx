'useClient';
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";


const TipOptions = () => {
    const [selectedTip, setSelectedTip] = useState<number | string>(10);
    return (
        <Box className="mt-4 p-3 border rounded-lg bg-white shadow-md">
            <Box className="flex items-center space-x-2">
                <EmojiObjectsIcon className="text-yellow-500" />
                <Typography variant="subtitle1" className="font-semibold">
                    Say thanks with a Tip!
                </Typography>
            </Box>
            <Typography variant="body2" className="text-gray-600 mt-1">
                Day & night, our delivery partners bring your favourite meals. Thank them with a tip.
            </Typography>

            {/* Tip Buttons */}
            <Box className="flex space-x-2 mt-3">
                {[5, 10, 20, "Other"].map((amount) => (
                    <Button
                        key={amount}
                        variant="outlined"
                        onClick={() => setSelectedTip(amount)}
                        className={`border-[#ccc] px-4 py-2  text-black relative ${selectedTip === amount ? "border-orange-500" : ""}`}
                    >
                        €{amount !== "Other" ? amount : "Other"}
                        {amount === 10 && (
                            <Box className="absolute mt-7 w-full max-w-3xl bg-orange-500 text-white text-[9px] px-0 py-0 space-x-2"
                                sx={{
                                    borderRadius: 0
                                }}>
                                Most Tipped
                            </Box>
                        )}
                    </Button>
                ))}
            </Box>
        </Box>
    )
}

export default TipOptions
