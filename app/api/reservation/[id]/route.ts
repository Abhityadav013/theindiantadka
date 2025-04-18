// app/api/reservation/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/libs/mongodb';
import Reservation from '@/app/models/Reservation';
import ApiResponse from '@/app/libs/common/ApiResponse';
import validator from 'validator';
import { parseISO, isAfter, isBefore, isValid, addMonths } from 'date-fns';

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

export async function PUT(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await connectToDatabase();

  const {params} = await context

  // No need to wrap params in await
  const { id: reservationId } = await params; // Directly access params without await
  const payload = await request.json();

  const { reservationName, phoneNumber, numberOfPeople, reservationDateTime } = payload;

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
  if (!normalizedPhone || !validator.isMobilePhone(normalizedPhone, 'de-DE')) {
    errors.push({
      key: 'phoneNumber',
      message: 'Please enter a valid german number',
    });
  }

  // Validate number of people
  if (
    !numberOfPeople ||
    isNaN(numberOfPeople) ||
    parseInt(numberOfPeople) <= 0
  ) {
    errors.push({
      key: 'numberOfPeople',
      message: 'Number of people should be a valid number greater than 0',
    });
  }

  // Validate reservation date
  if (!reservationDateTime || !validateReservationDate(reservationDateTime)) {
    errors.push({
      key: 'reservationDateTime',
      message:
        'Reservation date & time should be valid and within the next 2 months',
    });
  }

  // If there are any errors, return them to the client
  if (errors.length > 0) {
    const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
    return NextResponse.json(apiResponse, { status: apiResponse.statusCode });
  }

  const updatePayload = {
    reservationName,
    phoneNumber,
    numberOfPeople,
    reservationDateTime,
  };
  const updatedReservation = await Reservation.updateOne(
    { id: reservationId },
    { $set: { ...updatePayload } },
  );

  if (!updatedReservation) {
    return NextResponse.json(new ApiResponse(404, {}, 'Reservation not found'));
  }

  if (
    updatedReservation &&
    Object.keys(updatedReservation).length > 0 &&
    updatedReservation.modifiedCount > 0
  ) {
    return NextResponse.json(
      new ApiResponse(
        200,
        { id: reservationId },
        'Reservation updated successfully',
      ),
    );
  }
}

export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await connectToDatabase();
  const {params} = context;
  const { id: reservationId } = params; // No need to await here either

  const deleted = await Reservation.deleteOne({ id: reservationId });

  if (!deleted) {
    return NextResponse.json(new ApiResponse(404, {}, 'Reservation not found'));
  }

  return NextResponse.json(
    new ApiResponse(200, deleted, 'Reservation deleted successfully'),
  );
}
