import React, { useState } from "react";
import { Menu, MenuItem, Tooltip,  Box } from "@mui/material";
import { Logout, ShoppingCart, VerifiedUser, Person } from "@mui/icons-material";
import { UserProfile } from "../utils/types/user_details";

interface ProfileFormProps {
  logoutUser: () => void;
  sendOTP: () => void;
  userData: UserProfile;
}

const UserProfileMenu: React.FC<ProfileFormProps> = ({ userData, logoutUser, sendOTP }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!userData) return null; // Prevents rendering if no user data

  // Function to handle menu opening
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Extract first and last name initials
  const userName = userData.name?.split(" ") || ["User"];
  const initials = userName.length > 1 ? `${userName[0][0]}${userName[1][0]}` : userName[0][0];

  return (
    <div>
      <Tooltip title="User Menu">
        {/* Circle with initials */}
        <Box
          className="flex items-center justify-center cursor-pointer"
          onClick={handleMenuOpen} // Open menu on click
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#FF5733", // Circle color (you can change it)
            color: "#fff", // Text color inside the circle
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "40px",
          }}
        >
          {initials}
        </Box>
      </Tooltip>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose} // Close menu when clicking outside
        className="mt-2"
      >
        <MenuItem
          onClick={handleMenuClose}
          className="flex gap-2 hover:bg-gray-200"
        >
          <Person fontSize="small" /> Profile
        </MenuItem>

        {!userData.isAccountVerified && (
          <MenuItem
            onClick={() => { sendOTP(); handleMenuClose(); }}
            className="flex gap-2 hover:bg-gray-200"
          >
            <VerifiedUser fontSize="small" /> Verify Account
          </MenuItem>
        )}

        <MenuItem
          onClick={handleMenuClose}
          className="flex gap-2 hover:bg-gray-200"
        >
          <ShoppingCart fontSize="small" /> Your Orders
        </MenuItem>

        <MenuItem
          onClick={() => { logoutUser(); handleMenuClose(); }}
          className="flex gap-2 text-red-500 hover:bg-gray-200"
        >
          <Logout fontSize="small" /> Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserProfileMenu;
