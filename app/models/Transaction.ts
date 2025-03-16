import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // uuid for generating unique transactionId
import { Counter } from './Counter';

export const TransactionSchemaName = "Transaction"; // Collection name


interface IPaypalTransaction {
  capture_id: string;
  capture_status: string;
  fee: {
    value: string;
    currency_code: string;
  };
  customer_email:string
}

interface IStripeTransaction {
  payment_intent_id: string;
  charge_id: string;
  fee: number;
  customer_email: string;
}
interface ITransaction extends Document {
  transactionId: string;  // Make sure transactionId is part of the schema
  paymentIntentId: string;
  paymentProvider: 'paypal' | 'stripe';
  amount: number;
  currency: string;
  status: string;
  created: Date;
  paypal?: IPaypalTransaction;
  stripe?: IStripeTransaction;
  metadata?: Record<string, string | number | boolean>;
  displayId: string;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true,default: uuidv4, unique: true }, 
  displayId: { type: String, unique: true }, // Ensure transactionId is required and unique
  paymentProvider: { type: String, enum: ['paypal', 'stripe'], required: true },
  paymentIntentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  created: { type: Date, required: true },
  paypal: { type: Object },  // PayPal-specific fields
  stripe: { type: Object },  // Stripe-specific fields
  metadata: { type: Object },
},
{
    versionKey:false,
    collection:TransactionSchemaName
}
);

// Pre-save hook for generating transactionId and displayId
TransactionSchema.pre('save', async function (next) {
  if (this.isNew) {

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.displayId = `T${String(counter.seq).padStart(8, '0')}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction;

