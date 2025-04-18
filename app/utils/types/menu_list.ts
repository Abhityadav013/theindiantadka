export interface MenuList {
    title: string;
    subtitle?: string;
    hasDescription: boolean;
    items: {
      name: string;
      description?: string;
      price: string;
    }[];
  }


