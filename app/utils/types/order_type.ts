export interface Order{
    id: string,
    itemName: string,
    quantity: number,
    price: number // price base
}

// Define the structure for the unit_amount object
export interface UnitAmount {
    currency_code: string;  // Currency code (e.g., 'USD')
    value: string;          // Price per unit (e.g., '7')
  }
  
  // Define the structure for the item
  export interface OrderItem {
    id: string;             // Unique identifier for the item (optional)
    name: string;           // Name of the item (e.g., 'Samosa')
    quantity: number;       // Quantity of the item (e.g., 1)
    unit_amount: UnitAmount; // Unit amount object containing price and currency
  }
  
