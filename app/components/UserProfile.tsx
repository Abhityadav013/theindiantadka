import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Tooltip, Typography, Box } from "@mui/material";
import { Logout, ShoppingCart, VerifiedUser, Person } from "@mui/icons-material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle long name truncation after 8 words
  const userName = userData.name?.split(" ") || ["User"];
  const displayName = userName.length > 4 ? `${userName.slice(0, 8).join(" ")}...` : userName.join(" ");

  return (
    <div>
      <Tooltip title="User Menu">
        {/* Wrap icon and text inside Box for better styling */}
        <Box
          className="flex items-center gap-2 cursor-pointer"
          onMouseEnter={handleMenuOpen} // Open menu on hover
        >
          <IconButton className="p-1 hover:bg-transparent"> {/* Removes hover background */}
            <PersonOutlineIcon
              sx={{ fontSize: "30px", borderRadius: "50%", fill: "tomato" }}
            />
          </IconButton>
          <Typography
            variant="body2"
            className="text-gray-600 font-bold truncate" // Ensures long name is truncated
            style={{ maxWidth: "160px" }} // Sets a limit to the width for truncation
          >
            {displayName}
          </Typography>
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onMouseLeave={handleMenuClose} // Close menu when mouse leaves
        className="mt-2"
      >
        <MenuItem
          onClick={handleMenuClose}
          className="flex gap-2 hover:bg-gray-200" // Highlight on hover
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
