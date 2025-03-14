import mongoose, { Schema, Document } from 'mongoose';

interface IOrderTransaction extends Document {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  created: Date;
  metadata: object;
}

const orderTransactionSchema = new Schema<IOrderTransaction>({
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  created: { type: Date, required: true },
  metadata: { type: Object, required: true },
});

const OrderTransaction = mongoose.model<IOrderTransaction>('OrderTransaction', orderTransactionSchema);

export default OrderTransaction;
