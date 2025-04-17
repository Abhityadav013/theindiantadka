'use client'
import React from 'react'
import { Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { openCustomerDetailsModel } from '@/app/redux/reducers/customerDetailsReducer';

interface AddAddressButtonProps{
    textToDisplay:string
}

const AddAddressButton :React.FC<AddAddressButtonProps>= ({textToDisplay}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleProfileModal = () =>{
        console.log('')
        dispatch(openCustomerDetailsModel())
    }
    return (
        <Button variant="contained" className="bg-emerald-600 border-r-0 text-white" fullWidth sx={{ borderRadius: 0 }}
            onClick={handleProfileModal}>
           {textToDisplay}
        </Button>
    )
}

export default AddAddressButton
