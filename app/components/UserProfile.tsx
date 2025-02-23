import React, { useState } from "react";
import { Menu, MenuItem, Avatar, IconButton, Tooltip } from "@mui/material";
import { Logout, ShoppingCart, VerifiedUser, Person } from "@mui/icons-material";
import { UserProfile } from "../utils/types/user_details";

interface ProfileFormProps {
    logoutUser: () => void;
    userData: UserProfile;
}

const UserProfileMenu:React.FC<ProfileFormProps> = ({ userData, logoutUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!userData) {
    return null; // Return nothing if user is not logged in
  }

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userName = userData.name.split(" ");
  const initials = `${userName[0][0]}${userName[1] ? userName[1][0] : ""}`.toUpperCase();

  return (
    <div>
      <Tooltip title="User Menu">
        <IconButton className="p-1">
          <Avatar className="bg-blue-500 text-white">{initials}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        className="mt-2"
      >
        <MenuItem onClick={handleMenuClose} className="flex gap-2">
          <Person fontSize="small" /> Profile
        </MenuItem>
        <MenuItem className="flex gap-2">
            <VerifiedUser fontSize="small" /> Verify Account
          </MenuItem>
        {/* {!isAccountVerified && (
          <MenuItem onClick={() => { sendOTP(); handleMenuClose(); }} className="flex gap-2">
            <VerifiedUser fontSize="small" /> Verify Account
          </MenuItem>
        )} */}
        <MenuItem onClick={handleMenuClose} className="flex gap-2">
          <ShoppingCart fontSize="small" /> Your Orders
        </MenuItem>
        <MenuItem onClick={() => { logoutUser(); handleMenuClose(); }} className="flex gap-2 text-red-500">
          <Logout fontSize="small" /> Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserProfileMenu;
