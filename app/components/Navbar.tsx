'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface FieldError {
  key: string;
  message: string;
}

export type ErrorResponse = FieldError[];

const NavBar = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Offer', href: '/offer' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Reservation', href: '/reservation' }
  ];

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center space-x-6 w-full">
        {navLinks.map(({ label, href }) => (
          <Button
            key={href}
            component={Link}
            href={href}
            disableRipple
            sx={{
              color: "#FF6347",
              backgroundColor: "transparent",
              textTransform: "none",
              fontFamily: "var(--font-outfit)",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "translateY(-2px) scale(1.05)",
                transition: "all 0.3s ease"
              }
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Cart Icon + Hamburger for Mobile */}
      <Box className="relative flex items-center ml-4 md:ml-6">
        <Link href="/checkout">
          <Image
            src="https://testing.indiantadka.eu/assets/basket_icon.png"
            alt="Cart Icon"
            width={24}
            height={24}
            className="dark:invert sm:w-[20px]"
          />
        </Link>
        {cart.length > 0 && (
          <span className="absolute top-[-10px] right-[30px] w-[18px] h-[18px] bg-red-500 border-2 border-white text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
            {cart.length}
          </span>
        )}

        {/* Hamburger icon only on mobile */}
        <div className="md:hidden ml-4">
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: '#FF6347' }} />
          </IconButton>
        </div>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            bgcolor: '#fff',
            padding: 2
          }
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map(({ label, href }) => (
            <ListItem
              key={href}
              component={Link}
              href={href}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '1.2rem',
                  color: '#FF6347',
                  fontFamily: 'var(--font-outfit)'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
