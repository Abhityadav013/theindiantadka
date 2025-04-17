import { UserLocation } from '@/app/utils/types/user_location_type';
import { getDistanceFromLatLon, Location } from './distanceUserLocation';

interface GetDistanceFromLatLonProp {
  userLocation: UserLocation;
}
export async function getUserLocationFromLatLon({
  userLocation,
}: GetDistanceFromLatLonProp):Promise< number | boolean | string | undefined> {
  const INDIAN_TADKA_LAT = process.env.NEXT_PUBLIC_INDIAN_TADKA_LAT;
  const INDIAN_TADKA_LNG = process.env.NEXT_PUBLIC_INDIAN_TADKA_LNG;
  try {
    const restroLocation: Location = {
      lat: Number(INDIAN_TADKA_LAT),
      lon: Number(INDIAN_TADKA_LNG),
    };
    //console.log('restroLocation', userLocation)
    const parsedUserLocation: Location = {
      lat: userLocation?.lat ?? 0,
      lon: userLocation?.lng ?? 0,
    };

    // Get distance and handle it (store, log, or use it)
    const distance = getDistanceFromLatLon(
      restroLocation,
      parsedUserLocation,
    );
    console.log('distance', typeof distance);
    return distance
  } catch (error) {
    console.error('Error parsing user location:', error);
  }
}
