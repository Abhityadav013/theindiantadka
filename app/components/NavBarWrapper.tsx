'use client'
import Image from "next/image";
import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Link from "next/link";
import NavBar from "./Navbar";

const NavBarWrapper = () => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
      }}
    >
      <Toolbar className="px-4 md:px-0">
        {/* Logo */}
        <Link href="/" className="ml-[10%]">
          <Image
            src="https://testing.indiantadka.eu/assets/IndianTadkaHomeLogo.gif"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* NavBar handles its own responsive rendering */}
        <NavBar />
      </Toolbar>
    </AppBar>
  );
};

export default NavBarWrapper;
