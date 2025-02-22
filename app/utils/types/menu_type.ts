export type FilteredMenuItem = {
  menu_name: string;
  menu_image: string;
};

export type MenuItem = {
  itemId: string; // Unique identifier for the item
  itemName: string; // Name of the item
  price: number; // Price of the item
  category: string; // Category the item belongs to
  id: string; // Unique identifier for the item (can be used in UI or as a reference)
  createdAt: string; // Date and time when the item was created
  updatedAt: string; // Date and time when the item was last updated
  isDelivery: boolean; // Whether the item is available for delivery
};


export type FoodItem = {
  id: string;
  itemName: string;
  imageURL: string;
  price: number;
  description: string;
  category: string;
  isDelivery:boolean;
  tags: string[]; // Optional property
};
