import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const ProceedSection: React.FC = () => {
    const router = useRouter()
    const handleProceed = () =>{
        router.push('/checkout')
    }
    return (
        <Button
            variant="contained"
            sx={{
                position: "fixed",
                left: "50%",
                bottom: 0,
                transform: "translateX(-50%)",
                backgroundColor: "tomato",
                color: "white",
                width: "80%",
                padding: "12px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px -2px 10px rgba(0,0,0,0.2)", // Adds slight elevation
                zIndex: 50,
                borderRadius: "8px 8px 0 0", // Rounded top corners
                fontSize: "16px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff5233" }, // Darker shade on hover
            }}
            onClick={handleProceed}
        >
            Proceed To Checkout
        </Button>
    );
};

export default ProceedSection;
