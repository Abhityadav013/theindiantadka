'use client'
import { Box, TextField, Typography, Button, IconButton } from "@mui/material";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [isClient, setIsClient] = useState(false);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);

    const router = useRouter();

    const onBack = () => {
        router.back();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const tid = localStorage.getItem('tid'); // Retrieve tid from session storage
            const ssid = localStorage.getItem('ssid');
            const response = await fetch("/api/contact-us", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': ssid || '', // Add session ID to request headers
                    Tid: tid || '', // Add tid to request headers
                },
                body: JSON.stringify({ name, message }),
            });
            if (response.ok) {
                toast.success("Message sent successfully! 📩", {
                    duration: 2000, // Show toast for 2 seconds
                    style: {
                      padding: "16px 24px", // Adjusted padding
                      height: "80px", // Fixed height
                      fontSize: "16px", // Fixed font size
                      backgroundColor: "#28a745", // Green color for success
                      color: "#fff", // White text
                      borderRadius: "10px",
                    },
                    iconTheme: {
                      primary: "#fff", // White icon
                      secondary: "#28a745", // Green icon
                    },
                  });
                setMessage("");
                setName("");
            } else {
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="min-h-screen py-10 px-2 sm:px-6 md:px-12 lg:px-24 ">
            <IconButton
                edge="start"
                color="default"
                onClick={onBack}
                sx={{
                    position: "fixed",
                    top: isMobile ? 20 : 28,
                    left: isMobile ? 16 : 40,
                    zIndex: 1000
                }}
            >
                <ArrowBackIcon />
            </IconButton>

            <Box
                component="section"
                className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
                {/* Image Section */}
                <div className="flex justify-center items-center">
                    <Image
                        src="https://testing.indiantadka.eu/assets/contact-us.gif"
                        alt="Contact Us"
                        width={400}
                        height={400}
                        className="object-contain w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg"
                    />
                </div>

                {/* Contact Form */}
                <div className="flex flex-col justify-center w-full bg-white rounded-2xl shadow-md px-6 py-8 sm:px-10 sm:py-10">
                    <Typography variant="h4" className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                        Contact Us
                    </Typography>

                    <div className="mb-6 space-y-3 text-sm sm:text-base">
                        <div className="flex items-center text-gray-600">
                            <LocationOnIcon className="mr-2 text-tomato shrink-0" />
                            <Typography variant="body1" className="font-semibold">
                                Friedrichstraße 69, 66538 Neunkirchen, Germany
                            </Typography>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center text-gray-600">
                            <PhoneIcon className="mr-2 text-tomato shrink-0" />
                            <a
                                href="tel:+4915212628877"
                                className="font-semibold underline hover:text-tomato transition"
                            >
                                +49 1521 2628877
                            </a>
                        </div>

                        {/* Email */}
                        <div className="flex items-center text-gray-600 overflow-x-auto">
                            <EmailIcon className="mr-2 text-tomato shrink-0" />
                            <a
                                href="mailto:contact@indiantadka.eu"
                                className="font-semibold underline text-xs sm:text-sm hover:text-tomato transition whitespace-nowrap"
                            >
                                contact@indiantadka.eu
                            </a>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Your Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Your Message"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            className="w-full bg-tomato text-white py-2"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </Box>
        </div>
    );
};

export default ContactUs;
