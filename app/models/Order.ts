import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // uuid for generating unique orderId
import { OrderCounter } from './CounterOrder';

export const OrderSchemaName = "Order"; // Collection name

// Define the structure of the Order Schema
interface IOrder extends Document {
  orderId: string;  // Unique Order ID (UUID)
  displayId: string;  // Unique Display ID for the order
  tableNumber?: number;  // Table number, required if it's not an online or pickup order
  orderDate: string;  // Order date (ISO string or Date format)
  pickupOrder: boolean;  // Flag to identify pickup orders
  onlineOrder: boolean;  // Flag to identify online orders
  address: {
    place: string;
    houseNumber: string;
    postalCode: string;
    street: string;
    phoneNumber: string;
  };  // Address for delivery
  status: string;  // Status of the order
  paymentMethod?: string;  // Optional payment method (cash, card, etc.)
  orderItems: Array<{
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
    price: number;
  }>;  // List of ordered items
}

const orderSchema = new Schema<IOrder>({
  orderId: {
    type: String,  // UUID for orderId
    required: true,
    default: uuidv4,  // Automatically generate a UUID for orderId
  },
  displayId: {
    type: String,
    unique: true,  // Ensures the displayId is unique
  },
  tableNumber: {
    type: Number,
    required: function () {
      return !(this.pickupOrder === true || this.onlineOrder === true); // Table number is required for in-store orders
    },
  },
  orderDate: {
    type: String,
    required: true,
  },
  pickupOrder: {
    type: Boolean,
    required: false,
  },
  onlineOrder: {
    type: Boolean,
    required: false,
  },
  address: {
    place: {
      type: String,
      required: false,
    },
    houseNumber: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
  },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: false,
  },
  orderItems: [
    {
      itemId: {
        type: String,  // GUID for itemId
        required: true,
      },
      itemName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
}, 
{
  timestamps: true,  // Automatically add createdAt and updatedAt fields
  versionKey: false,  // Disable the "__v" version key
  collection: OrderSchemaName,
});

// Pre-save hook for generating displayId
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate displayId by incrementing the counter
    const counter = await OrderCounter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // Generate the displayId (e.g., "O00000001")
    this.displayId = `O${String(counter.seq).padStart(8, '0')}`;
  }
  next();
});

// Remove _id from orderItems when converting to JSON
orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Remove _id from each order item in the response
    ret.orderItems.forEach((item: { _id?: string }) => {
      delete item._id;
    });
    return ret;
  }
});

// Create and export the Order model
const Order = mongoose.model('OrderTest', orderSchema);

export default Order;
