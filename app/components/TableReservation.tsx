'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
} from '@mui/material';
import {
  LocalizationProvider,
  DateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function TableReservationForm() {
  const [reservationDateTime, setReservationDateTime] = useState<Date | null>(null);
  const [people, setPeople] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({
    reservationDateTime: false,
    people: false,
    phone: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      reservationDateTime: reservationDateTime === null,
      people: people === '',
      phone: phone.trim() === '',
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((val) => val)) {
      const formData = {
        reservationDateTime,
        people,
        phone,
      };

      console.log('Reservation submitted:', formData);
      alert('Reservation submitted!');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Book a Table</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Reservation Date & Time"
            value={reservationDateTime}
            onChange={(newDate) => setReservationDateTime(newDate)}
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: errors.reservationDateTime,
                helperText: errors.reservationDateTime ? 'Reservation date & time is required' : '',
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          label="Number of People"
          type="number"
          fullWidth
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          error={errors.people}
          helperText={errors.people ? 'Please enter number of people' : ''}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Phone Number"
          type="tel"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          helperText={errors.phone ? 'Phone number is required' : ''}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full !mt-4"
        >
          Reserve Table
        </Button>
      </form>
    </div>
  );
}
