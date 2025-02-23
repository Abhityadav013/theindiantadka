"use client"; // Client component directive

import React, { useEffect, useState } from "react";
import {
    Drawer,
    Button,
    TextField,
    Typography,
    Divider,
    IconButton,
    FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import close icon
import { GoogleLogin } from "@react-oauth/google"; // Google login import
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ErrorResponse } from "./Navbar";

// Define types for the props of the LoginForm component
interface LoginFormProps {
    onLogin: (values: LoginInput) => void;
    onSignIn: (values: SignInInput) => void;
    onGoogleLogin: (credential: string) => void; // GoogleLogin's response is the credential string
    isOpen: boolean;
    onClose: () => void; // onClose function to close the drawer
    error: ErrorResponse | null;
    setFormError: (values: ErrorResponse) => void
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface SignInInput {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onLogin,
    onSignIn,
    onGoogleLogin,
    isOpen,
    onClose,
    error,
    setFormError
}) => {
    const [isLoading, setIsLoading] = useState(false); // For handling loading state during form submission
    const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Sign Up
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state
    const [name, setName] = useState(""); // Name for sign-up
    const [phoneNumber, setPhoneNumber] = useState(""); // Phone number for sign-up
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password for sign-up

    useEffect(() => {
        if (error?.length) {
            setIsLoading(false)
        }
    }, [error])

    useEffect(() => {
        if (isLogin) {
            setName("");
            setPhoneNumber("");
            setPassword("");
            setConfirmPassword("");
        }
    }, [isLogin]);  // This effect will run when `isLogin` state changes
    

    // Handle form submission
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (isLogin) {
                await onLogin({ email, password }); // Call the passed function for form submission
            } else {
                const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
                await onSignIn({ name, email, phoneNumber: formattedPhoneNumber, password, confirmPassword }); // Call the passed function for form submission
            }
        } catch (err) {
            console.error("Login failed:", err);
        };
    }

    const getErrorMessage = (key: string) => {
        return error?.find((err) => err.key === key)?.message || null;
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "100%",
                    maxWidth: "500px",
                    height: "100%",
                },
            }}
        >
            <div className="w-full p-6 rounded-t-xl relative">
                {/* Close button */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    sx={{ position: "absolute", top: 10, left: 10 }}
                >
                    <CloseIcon />
                </IconButton>

                <div className="text-center mb-6">
                    <Typography variant="h5" className="text-xl text-tomato font-semibold">
                        {isLogin ? "Login" : "Sign Up"}
                    </Typography>
                    <Typography
                        variant="body2"
                        className="text-sm mt-10 text-gray-600 pl-1 text-left"
                    >
                        Please enter your details
                    </Typography>
                </div>

                {!isLogin && (
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4"
                        required
                    />
                )}

                <div>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4"
                        required
                        error={!!getErrorMessage("email")}
                        helperText={getErrorMessage("email")} // Show error for email
                    />

                    {!isLogin && (
                        <div className="mb-4">
                            <PhoneInput
                                country={"de"} // Default country set to Germany
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                preferredCountries={["de"]} // Always show Germany at the top
                                enableSearch={true} // Allow searching for country codes
                                disableSearchIcon={false} // Show a search icon
                                autoFormat={true} // Auto-format the input for better UX
                                priority={{ de: 1 }} // Ensures 'DE' stays at the top of the list when opening
                                inputStyle={{
                                    width: "100%",
                                    height: "56px",
                                    fontSize: "16px",
                                    paddingLeft: "50px", // Adjust space for flag & country code
                                }}
                                containerStyle={{
                                    width: "100%",
                                }}
                                buttonStyle={{
                                    background: "transparent",
                                }}
                                dropdownStyle={{
                                    maxHeight: "250px", // Limit height to prevent excessive scrolling
                                    overflowY: "auto", // Enable scrolling
                                    zIndex: 1000, // Ensure it's above other elements
                                }}
                                searchStyle={{
                                    width: "90%",
                                    margin: "10px auto",
                                    padding: "8px",
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                }}
                            />
                            {getErrorMessage('phoneNumber') && (
                                <FormHelperText error>
                                    {getErrorMessage("phoneNumber")}
                                </FormHelperText>
                            )}
                        </div>
                    )}

                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                        required
                        error={!!getErrorMessage("password")}
                        helperText={getErrorMessage("password")} // Show error for password
                    />

                    {!isLogin && (
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mb-4"
                            required
                            error={!!getErrorMessage("confirmPassword")}
                            helperText={getErrorMessage("confirmPassword")}
                        />
                    )}
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="mb-4"
                >
                    {isLoading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
                </Button>

                <Divider className="mb-4">OR</Divider>

                <div className="text-center mb-4">
                    <GoogleLogin
                        onSuccess={({ credential }) => onGoogleLogin(String(credential))}
                        onError={() => alert("Google login failed")}
                    />
                </div>

                <div className="text-center">
                    <Typography variant="body2" className="text-sm">
                        {isLogin ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Button onClick={() => { setIsLogin(false); setFormError([]) }} color="primary">
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Button onClick={() => { setIsLogin(true); setFormError([]) }} color="primary">
                                    Login
                                </Button>
                            </>
                        )}
                    </Typography>
                </div>
            </div>
        </Drawer>
    );
};

export default LoginForm;
