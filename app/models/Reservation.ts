import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Counter from './Counter';

export const ReservationSchemaName = 'Reservation'; // Collection name

interface IReservation extends Document {
  id: string;
  displayId: string;
  reservationDateTime: Date;
  reservationName: string;
  numberOfPeople: string;
  phoneNumber: string;
  deviceId: string;
  tid: string;
}

const ReservationSchema = new Schema<IReservation>(
  {
    id: {
      type: String, // GUID for Booking ID
      required: true,
      default: uuidv4, // Automatically generate a GUID if not provided
    },
    displayId: {
      type: String,
      unique: true, // Ensures the displayId is unique
    },
    reservationDateTime: {
      type: Date,
      required: true,
    },
    reservationName: {
      type: String,
      required: true,
    },
    numberOfPeople: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    deviceId: { type: String, required: true },
    tid: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Disable the "__v" version key
    collection: ReservationSchemaName,
  },
);

ReservationSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Get the counter for 'order' type and increment the sequence
      const counter = await Counter.findOneAndUpdate(
        { _id: 'reservation' }, // Find by the 'order' type
        { $inc: { seq: 1 } }, // Increment the sequence
        { new: true, upsert: true }, // Create if not found
      );

      // Generate the displayId (e.g., "O00000001")
      this.displayId = `R${String(counter.seq).padStart(8, '0')}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error generating displayId:', err);
      next(err);
    }
  }
  next();
});

// Create and export the Order model
const Reservation =
  mongoose?.models?.Reservation ||
  mongoose.model('Reservation', ReservationSchema);

export default Reservation;
