import { reverse_geocode_url } from '@/app/utils/api_url';
import { UserAddress } from '@/app/utils/types/address_type';
import { CustomerOrder } from '@/app/utils/types/customer_details_type';
import {
  Location,
  PostCodePlace,
  RoadElementsResponse,
} from '@/app/utils/types/location_type';
import { UserLocation } from '@/app/utils/types/user_location_type';

export const fetchCustomerDetailsApi = async (): Promise<CustomerOrder> => {
  const tid = localStorage.getItem('tid'); // Retrieve tid from session storage
  const ssid = localStorage.getItem('ssid');

  const response = await fetch('/api/user-details', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      //'Session-Id': ssid || '', // Add session ID to request headers
      ssId: ssid || '', // Add session ID to request headers
      Tid: tid || '', // Add tid to request headers
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customer details');
  }

  if (data.data && Object.keys(data.data).length === 0) {
    return {} as CustomerOrder;
  }
  const result = {
    customerDetails: {
      name: data.data.name,
      phoneNumber: data.data.phoneNumber,
      address: data.data.address || ({} as UserAddress),
      isFreeDelivery: data.data.isFreeDelivery,
      deliveryFee: data.data.deliveryFee,
      notDeliverable: data.data.notDeliverable,
    },
    orderType: data.data.orderMethod,
  };

  return result as CustomerOrder;
};

export const fetchCustomerLocationApi = async (
  address: string,
): Promise<UserLocation> => {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
    format: 'json',
    q: address,
  });

  const response = await fetch(`${reverse_geocode_url}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    return { lat: 0, lng: 0 } as UserLocation;
    // throw new Error(data.message || 'Failed to fetch customer details');
  }

  return { lat: data[0].lat, lng: data[0].lon } as UserLocation;
};

export const fetchLocationApi = async (
  address: string,
): Promise<Location[]> => {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
    format: 'json',
    q: address,
  });

  const response = await fetch(`${reverse_geocode_url}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    return [] as Location[];
    // throw new Error(data.message || 'Failed to fetch customer details');
  }

  return data as Location[];
};

export const fetchPlaceByPostalCode = async (
  postalCode: string,
): Promise<PostCodePlace[]> => {
  try {
    if (postalCode.length === 5) {
      // Ensure 5 characters before calling API
      const response = await fetch(
        `https://api.zippopotam.us/de/${postalCode}`,
      );
      if (!response.ok) {
        throw new Error('Invalid postal code');
      }
      const data = await response.json();
      return data.places;
    }
  } catch (err: unknown) {
    console.log(err);
    return [] as PostCodePlace[];
  }
  return [] as PostCodePlace[];
};

export const fetchStreetsByPostalCode = async (
  postalCode: string,
): Promise<string[]> => {
  const url = `https://overpass-api.de/api/interpreter?data=[out:json];area["postal_code"=${postalCode}]->.searchArea;way(area.searchArea)["highway"]["name"];out%20tags;`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const { elements }: RoadElementsResponse = data;
    if (elements && elements.length > 0) {
      const streetName = elements
        .map((item) => item.tags.name)
        .filter((name) => name);
      const res = [...new Set(streetName.filter((name): name is string => name !== undefined))];
      return res;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateReservation = async (reservationId: string, updatedData: any) => {
  try {
    const response = await fetch(`/api/reservation/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'reservation-id': reservationId, // You can pass reservationId in the headers
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating reservation:', error);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    const response = await fetch(`/api/reservation/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'reservation-id': reservationId, // Reservation ID passed in headers for deletion
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting reservation:', error);
  }
};