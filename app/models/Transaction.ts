import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Counter } from './Counter';


interface ITransaction extends Document {
  paymentProvider: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  created: Date;
  metadata: Record<string, string | number | boolean>;
  transactionId: string;
  displayId: string;
}

const transactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  paymentProvider: { type: String, required: true },
  paymentIntentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  created: { type: Date, required: true },
  metadata: { type: Object, required: true },
  displayId: { type: String, unique: true }, // Unique displayId
});

// Pre-save hook for generating transactionId and displayId
transactionSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.transactionId = uuidv4(); // Generate unique transactionId

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.displayId = `T${String(counter.seq).padStart(8, '0')}`;
  }
  next();
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
