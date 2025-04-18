import validator from 'validator';
import { addMonths, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import Reservation from '@/app/models/Reservation';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/libs/mongodb';
import ApiResponse from '@/app/libs/common/ApiResponse';

// Helper function to validate reservation date
const validateReservationDate = (date: string): boolean => {
  const reservationDate = parseISO(date);
  const currentDate = new Date();
  const maxDate = addMonths(currentDate, 2);

  return (
    isValid(reservationDate) &&
    !isBefore(reservationDate, currentDate) &&
    !isAfter(reservationDate, maxDate)
  );
};

// The handler for the reservation API route
export async function POST(request: NextRequest) {
  await connectToDatabase(); // Ensure DB connection

  try {
    const payload = await request.json();
    const tId = request.headers.get('tid') || '';
    const ssId = request.headers.get('session-id') || '';

    const {
      reservationName,
      phoneNumber,
      numberOfPeople,
      reservationDateTime,
    } = payload;

    // Server-side validation
    const errors = [];

    // Validate name
    if (!reservationName || reservationName.trim() === '') {
      errors.push({ key: 'reservationName', message: 'Name is required' });
    }

    // Validate phone number

    const normalizedPhone = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+${phoneNumber}`;
    if (
      !normalizedPhone ||
      !validator.isMobilePhone(normalizedPhone, 'de-DE')
    ) {
      errors.push({ key: 'phoneNumber', message: 'Please enter a valid german number' });
    }

    // Validate number of people
    if (
      !numberOfPeople ||
      isNaN(numberOfPeople) ||
      parseInt(numberOfPeople) <= 0
    ) {
      errors.push({ key: 'numberOfPeople', message: 'Number of people should be a valid number greater than 0' });
    }

    // Validate reservation date
    if (!reservationDateTime || !validateReservationDate(reservationDateTime)) {
      errors.push({ key: 'reservationDateTime', message:'Reservation date & time should be valid and within the next 2 months' });
    }

    // If there are any errors, return them to the client
    if (errors.length > 0) {
      const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
      return NextResponse.json(apiResponse, { status: apiResponse.statusCode });
    }

    const reservation = new Reservation({
      reservationName: reservationName,
      reservationDateTime: reservationDateTime,
      phoneNumber: phoneNumber,
      numberOfPeople: numberOfPeople,
      deviceId: ssId,
      tid: tId,
    });

    // Save the order
    await reservation.save();

    return NextResponse.json(
      {
        message: 'Reservation created successfully',
        reservation: reservation,
      },
      { status: 201 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Error creating reservation',
        error: error.message,
      },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const ssId = request.headers.get('ssid') || '';
    const reservationInfo = await Reservation.find({ deviceId: ssId })
      .select('-_id -deviceId -tid')
      .lean(); // Fetch all user data
    return NextResponse.json(
      new ApiResponse(
        200,
        [...reservationInfo],
        'User info fetched successfully.',
      ),
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