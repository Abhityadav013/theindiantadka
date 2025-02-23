import axios from "axios";
import { UserLocation } from "./types/user_location_type";
import { location_url } from "./api_url";
// import { Address } from "./types/address_type";

export const getLocationData = async (location: UserLocation) => {
    const { lat, lng }: UserLocation = location;
    const params = lat && lng ? { lat, lon: lng } : {};
    
    const locationApiResponse = await axios.get<string | null>(location_url || '', { params });
    const userAddress = Array.isArray(locationApiResponse.data) ? locationApiResponse.data[0] : locationApiResponse.data;
    
    return userAddress?.address; // Ensure we return the correct address object
  };
  