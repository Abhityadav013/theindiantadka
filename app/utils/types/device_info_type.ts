import { UserLocation } from "./user_location_type";

export interface DeviceInfo{
    deviceId:string;
    statusMessage:string
    tid:string;
}

export interface RegisterSessionResponse {
    tid: string;
    userLocation: UserLocation; // Ensure this field is expected
  }