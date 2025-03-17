import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // For example 'orderId'
  seq: { type: Number, default: 0 },     // Sequence value
});

const Counter = mongoose.models.Counter || mongoose.model('CounterPaymentTest', counterSchema);

export { Counter };
