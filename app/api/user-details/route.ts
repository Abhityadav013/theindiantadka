import ApiResponse from '@/app/libs/common/ApiResponse';
import { OrderType } from '@/app/models/Order';
import UserInfo from '@/app/models/UserInfo';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/libs/mongodb';
import { UserLocation } from '@/app/utils/types/user_location_type';
import { fetchCustomerLocationApi, fetchLocationApi } from '@/app/redux/sagas/commonAPIs';
import { getUserLocationFromLatLon } from '@/app/libs/common/getUserLocation';
import { Location } from '@/app/utils/types/location_type';
import validator from 'validator';

// import { isValidNumber } from 'libphonenumber-js';
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const tId = request.headers.get('tid') || '';
    const ssId = request.headers.get('session-id') || '';

    const { userInfo, orderType } = payload;
    const errors = [];
    // Validate required fields

    if (userInfo.name == '' || userInfo.phoneNumber == '') {
      const isNameGiven = userInfo.name.trim().length > 0;
      const isPhoneNumberGiven = userInfo.phoneNumber.trim().length > 0;
      const normalizedPhone = userInfo.phoneNumber.startsWith('+') ? userInfo.phoneNumber : `+${userInfo.phoneNumber}`;
      if (!isNameGiven) {
        errors.push({ key: 'name', message: 'Please enter the name' });
      }
      if (!isPhoneNumberGiven) {
        errors.push({
          key: 'phoneNumber',
          message: 'Please enter the phone number',
        });
      }     if (
        !normalizedPhone ||
        !validator.isMobilePhone(normalizedPhone, 'de-DE')
      ){
        errors.push({ key: 'phoneNumber', message: 'Valid German phone number is required.' });
      }
          
      
    }

    if (errors.length > 0 && orderType === OrderType.PICKUP) {
      const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
      return NextResponse.json(apiResponse, {
        status: apiResponse.statusCode,
      });
    }
    // Validate address fields if order type is DELIVERY
    if (orderType === OrderType.DELIVERY) {
      const addressFields = [
        'pincode',
        'buildingNumber',
        'town',
        'street',
        'displayAddress',
        'addressType',
      ];
      addressFields.forEach((field) => {
        if (!userInfo.address?.[field]) {
          errors.push({ key: field, message: `${field} is required.` });
        }
      });

      const isValidPincode = /^\d{5}$/.test(userInfo.address.pincode.trim());
      if (!isValidPincode) {
        errors.push({ key: 'pincode', message: 'Invalid pincode.' });
      }

      // 2. Validate buildingNumber: Check if it's alphanumeric or numeric
      const isValidBuildingNumber = /^[a-zA-Z0-9\s]+$/.test(
        userInfo.address.buildingNumber.trim(),
      );

      if (!isValidBuildingNumber) {
        errors.push({
          key: 'buildingNumber',
          message: 'Invalid buildingNumber.',
        });
      }

      // 3. Validate street: Should contain alphabetic characters, spaces, and hyphens (for streets like "Maximilianstraße")
      const isValidStreet = /^[a-zA-ZäöüßÄÖÜ0-9\s\-]+$/.test(
        userInfo.address.street.trim(),
      );

      if (!isValidStreet) {
        errors.push({ key: 'isValidStreet', message: 'Invalid street.' });
      }
      const location:Location[] = await fetchLocationApi(userInfo.address.displayAddress)
      const isValid =  isValidAddress(location)
      if(location && !isValid && errors.length == 0){
        const locationError = [
          { key: 'town', message: 'Please check the town name' },
          { key: 'street', message: 'Please check the street name.' },
          { key: 'pincode', message: 'Please check the pincode' },
        ]
        errors.concat(locationError)
      }
    }

    // Return validation errors if any
    if (errors.length > 0) {
      const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
      return NextResponse.json(apiResponse, { status: apiResponse.statusCode });
    }

    // Save user info to database
    await connectToDatabase();
    console.log('Saving user info:', userInfo);

    let userInformation = await UserInfo.findOne({
      deviceId: ssId,
      tid: tId,
    });

    let deliveryFee,
      isFreeDelivery = false,
      notDeliverable = false,
      userLocation: UserLocation = { lat: 0, lng: 0 };

    if (orderType === OrderType.DELIVERY) {
      userLocation = await fetchUserLocation(userInfo.address.displayAddress);
      console.log('userLocation>>>>>>>>>>>>',userLocation)
      const getlocationInsights = await getUserLocationFromLatLon({
        userLocation,
      });

      if (
        typeof getlocationInsights !== 'boolean' &&
        typeof getlocationInsights !== 'string'
      ) {
        deliveryFee = String(getlocationInsights);
      } else if (typeof getlocationInsights === 'string') {
        isFreeDelivery = true;
      } else {
        notDeliverable = true;
      }
    }

    if (userInformation && Object.keys(userInformation).length > 0) {
      // Update existing user info
      userInformation.name = userInfo.name;
      userInformation.phoneNumber = userInfo.phoneNumber;
      userInformation.address = userInfo.address;
      userInformation.deliveryFee = deliveryFee;
      userInformation.isFreeDelivery = isFreeDelivery;
      userInformation.notDeliverable = notDeliverable
      userInformation.orderMethod =
        orderType === OrderType.DELIVERY ? 'DELIVERY' : 'PICKUP';

      if (orderType === OrderType.PICKUP) {
        console.log('its exits here')
        userInformation.address = undefined;
        userInformation.deliveryFee = undefined;
        userInformation.isFreeDelivery = undefined;
        userInformation.notDeliverable = undefined;
      
        // mark fields as modified (important!)
        userInformation.markModified('address');
        userInformation.markModified('deliveryFee');
        userInformation.markModified('isFreeDelivery');
        userInformation.markModified('notDeliverable');
        await userInformation.save();
      }
    } else {
      userInformation = new UserInfo({
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        ...(orderType === OrderType.DELIVERY && {
          address: userInfo.address,
        }),
        deviceId: ssId,
        tid: tId,
        orderMethod: orderType === OrderType.DELIVERY ? 'DELIVERY' : 'PICKUP',
        userLocation: userLocation,
        deliveryFee: deliveryFee,
        isFreeDelivery: isFreeDelivery,
        notDeliverable: notDeliverable,
      });
    }
    await userInformation.save();

    const userData = userInformation.toObject();
    delete userData._id;
    delete userData.deviceId;
    delete userData.tid;

    // Success response
    return NextResponse.json(
      new ApiResponse(
        200,
        { ...userData },
        'User information saved successfully.',
      ),
    );
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      new ApiResponse(
        500,
        { error: `Internal Server Error: ${error}` },
        'An error occurred.',
      ),
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const ssId = request.headers.get('ssid') || '';
    const userInfo = await UserInfo.findOne({ deviceId: ssId })
      .select('-_id -deviceId -tid')
      .lean(); // Fetch all user data
    return NextResponse.json(
      new ApiResponse(200, { ...userInfo }, 'User info fetched successfully.'),
    );
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      new ApiResponse(
        500,
        { error: `Internal Server Error: ${error}` },
        'Failed to fetch user info.',
      ),
    );
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchUserLocation = async (fetchAddress: string) => {
  let isFetched = false;
  const MAX_TRIES = 3;
  let attempt = 1;
  let locationData: UserLocation = { lat: 0, lng: 0 }; // Initialize with default values
  while (!isFetched && attempt <= MAX_TRIES) {
    locationData = await fetchCustomerLocationApi(fetchAddress);
console.log('locationData::::::::::::',locationData)
    if (
      locationData &&
      locationData.lat !== 0 &&
      locationData.lng !== 0 &&
      Object.keys(locationData).length > 0
    ) {
      isFetched = true;
      break;
    }
    await sleep(1000);
    attempt++;
  }
  return locationData;
};


const isValidAddress = (response: Location[]): boolean => {
  return Array.isArray(response) &&
         response.length > 0 &&
         !!response[0].lat &&
         !!response[0].lon &&
         !!response[0].display_name;
};