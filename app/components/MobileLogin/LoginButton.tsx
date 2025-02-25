'use client'
import React from 'react'
import { Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { setLoginModal } from '@/app/redux/reducers/userProfileReducer';

const LoginButton = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleProfileModal = () =>{
        dispatch(setLoginModal(true))
    }
    return (
        <Button variant="contained" className="bg-tomato border-r-0 text-white" fullWidth sx={{ borderRadius: 0 }}
            onClick={handleProfileModal}>
            Login
        </Button>
    )
}

export default LoginButton
