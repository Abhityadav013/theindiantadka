'use client'
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch } from "../redux/store";


const CookieConsentPopup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [cookieConsent, setCookieConsent] = useState(false);
    const [locationConsent, setLocationConsent] = useState(false);
    const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);
    const onClose = () =>{
        setOpen(() =>!open)
    }

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        const locationConsent = localStorage.getItem("locationConsent");
        if (!consent) {
            setOpen(true);
        }
        if(locationConsent){
            dispatch({ type: "user/fetchUserLocation" });
        }
    }, [dispatch,open]);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", cookieConsent ? "true" : "false");
        localStorage.setItem("locationConsent", locationConsent ? "true" : "false");
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleAccept}
            className="backdrop-blur-sm"
        >
            <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                sx={{ position: "absolute", top: 10, left: 10 }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Cookie Consent 🍪
            </DialogTitle>
            <DialogContent className={`text-gray-600 p-4 ${isMobileView ? "text-sm" : "text-base"}`}>
                <p>We use cookies to improve your experience. Please choose your preferences below:</p>
                <div className="mt-4">
                    <FormControlLabel
                        control={<Checkbox checked={cookieConsent} onChange={(e) => setCookieConsent(e.target.checked)} />}
                        label="Allow cookies for a better experience"
                    />
                </div>
                <div className="mt-2">
                    <FormControlLabel
                        control={<Checkbox checked={locationConsent} onChange={(e) => setLocationConsent(e.target.checked)} />}
                        label="Allow access to location"
                    />
                </div>
            </DialogContent>
            <DialogActions className="flex justify-center p-4">
                <Button
                    onClick={handleAccept}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto"
                >
                    Accept
                </Button>
                <Button
                   onClick={onClose}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full md:w-auto"
                >
                    Decline
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CookieConsentPopup