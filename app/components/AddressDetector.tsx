"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AddressDetector: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "address/fetchUserAddressSaga" });
  }, [dispatch]);

  return <></>;
};

export default AddressDetector;
