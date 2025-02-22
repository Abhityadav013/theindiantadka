import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Box } from "@mui/material";
import NavBar from "./Navbar";

const NavBarWrapper = () => {

    return (
        <Box className="py-5 flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
                <Image
                    src="https://testing.indiantadka.eu/logo.png"
                    alt="Logo"
                    width={180}
                    height={38}
                    className="dark:invert w-[150px] md:w-[140px] sm:w-[120px]"
                />
            </Link>

            {/* Navigation Links */}
            <Box className="hidden md:flex gap-5 text-[#49557e] text-lg sm:text-base">
                <Link href="/" className="hover:text-tomato">Home</Link>
                <a href="#explore-menu" className="hover:text-tomato">Menu</a>
                <a href="#app-download" className="hover:text-tomato">App Download</a>
                <a href="#footer" className="hover:text-tomato">Contact Us</a>
            </Box>
            <NavBar/>
        </Box>
    );
};

export default NavBarWrapper;
