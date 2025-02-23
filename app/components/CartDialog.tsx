"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextareaAutosize, IconButton } from "@mui/material";
import { CartDescription } from "../utils/types/cart_type";
import CloseIcon from "@mui/icons-material/Close";

interface CartCustomizeProps {
    isOpen: boolean;
    onClose: () => void;
    foodData: foodData;
    cartDescription:string
    onSubmit: (value: DescriptionSubmit) => void;

}

export interface foodData {
    itemId: string
    itemName: string,
}
export interface DescriptionSubmit {
    description: CartDescription
}

const CartDialog: React.FC<CartCustomizeProps> = ({ isOpen, onClose, foodData, onSubmit ,cartDescription}) => {
    const [description, setDescription] = useState(cartDescription || "");

    const submitDescription = () => {
        onSubmit({
            description: {
                itemId: foodData.itemId,
                description: description
            }
        })
    }
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="bg-gray-100 text-gray-800">{foodData.itemName}</DialogTitle>
            <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    top: 10, // 10px from the top of the container
                    right: 20, // 10px from the right of the container
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent className="p-4">
                {/* Description Input */}
                <label className="block text-gray-700 text-sm font-semibold mb-1">Add a Note:</label>
                <TextareaAutosize
                    minRows={4}
                    placeholder="Write additional instructions here..."
                    className="w-full border rounded-md p-2 text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </DialogContent>
            {/* Dialog Actions */}
            <DialogActions className="bg-gray-100">
                <Button onClick={() => submitDescription()} className="bg-green-500 text-white px-4 py-2 rounded-md">
                    Add Description
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CartDialog;
