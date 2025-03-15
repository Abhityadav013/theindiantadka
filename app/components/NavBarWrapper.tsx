import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Box } from "@mui/material";
import NavBar from "./Navbar";

const NavBarWrapper = () => {

    return (
        <Box className="py-5 flex justify-between items-center">
            <Link href="/">
                <Image
                    src="https://d17b2befa637skvb.public.blob.vercel-storage.com/logo.jpg"
                    alt="Logo"
                    width={80}
                    height={18}
                    className="w-[150px] md:w-[140px] sm:w-[120px]"
                />
            </Link>
            <NavBar/>
        </Box>
    );
};

export default NavBarWrapper;
