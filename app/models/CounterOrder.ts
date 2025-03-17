import mongoose from 'mongoose';

export const OrderCounterSchemaName = 'CounterOrderTest'; // Collection name
const OrderCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // For example 'orderId'
    seq: { type: Number, default: 0 }, // Sequence value
  },
  {
    collection: OrderCounterSchemaName,
    versionKey: false,
  },
);

const OrderCounter = mongoose.model('CounterOrderTest', OrderCounterSchema);
// mongoose.models.Counter || mongoose.model('CounterOrderTest', counterSchema);

export { OrderCounter };
