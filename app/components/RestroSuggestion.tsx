import { Divider, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReceiptIcon from '@mui/icons-material/Receipt';
const RestroSuggestion = () => {
    const [text, setText] = useState("");
    
    useEffect(() => {
        const savedText = localStorage.getItem("restaurantSuggestion");
        if (savedText) {
            setText(savedText);
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        localStorage.setItem("restaurantSuggestion", event.target.value);
    };

    return (
        <>
            <Divider className="mt-4 mb-4" style={{ border: "1px solid rgba(2, 6, 12, .1)" }} />
            <TextField
                fullWidth
                placeholder="Write Suggestion to restaurant..."
                onChange={handleChange}
                value={text}
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <ReceiptIcon />
                        </InputAdornment>
                    ),
                    disableUnderline: true,
                }}
            />
        </>
    )
}

export default RestroSuggestion
