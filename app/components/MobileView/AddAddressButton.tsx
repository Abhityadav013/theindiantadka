'use client'
import React from 'react'
import { Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { openAddressModel } from '@/app/redux/reducers/addressReducer';

const AddAddressButton = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleProfileModal = () =>{
        dispatch(openAddressModel())
    }
    return (
        <Button variant="contained" className="bg-emerald-600 border-r-0 text-white" fullWidth sx={{ borderRadius: 0 }}
            onClick={handleProfileModal}>
            Add Address To Proceed
        </Button>
    )
}

export default AddAddressButton
