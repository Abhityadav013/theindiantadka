import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // uuid for generating unique menuItemId

export const MenuSchemaName = "Menu"; // Collection name

// Define the structure of the Menu Schema
interface IMenu extends Document {
  id: string;  // Unique Menu Item ID (UUID)
  itemId: string;  // The unique identifier of the menu item
  itemName: string;  // Name of the menu item
  price: number;  // Price of the menu item
  category: string;  // Category of the menu item (e.g., appetizer, main course, etc.)
}

const MenuSchema = new Schema<IMenu>({
  id: {
    type: String,  // UUID for id
    required: true,
    default: uuidv4,  // Automatically generate a UUID for the itemId
  },
  itemId: {
    type: String,  // Unique item ID for the menu
    required: true,
  },
  itemName: {
    type: String,  // Name of the menu item
    required: false,
  },
  price: {
    type: Number,  // Price of the menu item
    required: true,
  },
  category: {
    type: String,  // Category of the menu item
    required: true,
  },
}, 
{
  timestamps: true,  // Automatically add createdAt and updatedAt fields
  versionKey: false,  // Disable the "__v" version key
  collection: MenuSchemaName,  // Use the collection name
});

// Remove _id from the response when querying (optional)
MenuSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Optionally remove _id from the response
    delete ret._id;
    return ret;
  }
});

// Create and export the Menu model
const Menu =   mongoose?.models?.Menu || mongoose.model('Menu', MenuSchema);

export default Menu;
