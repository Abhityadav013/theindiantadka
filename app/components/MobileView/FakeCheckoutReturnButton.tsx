'use client'
import React from 'react'
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';

const FakeCheckOutReturn = () => {
   const history = useRouter();

    const handleProfileModal = () =>{
        history.back()
    }
    return (
        <Button variant="contained" className="bg-tomato border-r-0 mt-5 text-white" sx={{ borderRadius: 0 }}
            onClick={handleProfileModal}>
            Go Back
        </Button>
    )
}

export default FakeCheckOutReturn
