"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import { setMobileView } from "../redux/slices/mobileSlice";

const MobileViewDetector: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMobileView(isMobile));
  }, [isMobile, dispatch]);

  return null;
};

export default MobileViewDetector;
