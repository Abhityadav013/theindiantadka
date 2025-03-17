import { NextRequest, NextResponse } from 'next/server';
import Order from '@/app/models/Order';
import { connectToDatabase } from '@/app/libs/mongodb';
import Menu from '@/app/models/Menu';

export async function POST(request: NextRequest) {
  await connectToDatabase(); // Ensure DB connection

  try {
    const { items, orderDate, onlineOrder = true, address = {}, status = "INPROGRESS" } = await request.json();

    // Ensure onlineOrder is true and validate provided data
    if (!onlineOrder) {
      return NextResponse.json({ message: "This endpoint is for online orders only." }, { status: 400 });
    }

    if (!items || items.length === 0 || !orderDate) {
      return NextResponse.json({ message: "Items and orderDate are required." }, { status: 400 });
    }

    // Fetch the menu items from the Menu schema (multiple items can be fetched in one query)
    const itemIds = items.map((item: { itemId: string }) => item.itemId);
    const menuItems = await Menu.find({ id: { $in: itemIds } });

    if (menuItems.length !== items.length) {
      return NextResponse.json({ message: "One or more menu items not found." }, { status: 404 });
    }

    // Calculate total order amount and map items with the required details
    let totalAmount = 0;
    const orderItems = items.map((item: { itemId: string; quantity: number }) => {
      const menuItem = menuItems.find(menu => menu.id === item.itemId);
      
      if (menuItem) {
        const itemTotal = menuItem.price * item.quantity;  // Calculate item total
        totalAmount += itemTotal;

        return {
          itemId: menuItem._id,  // Using the menu item's _id for the order
          itemName: menuItem.itemName,
          category: menuItem.category,
          quantity: item.quantity,
          price: menuItem.price,
        };
      }
      return null;  // Should not happen as we validate items exist earlier
    }).filter(Boolean);  // Remove any null items

    // Create the order with the calculated order items and total amount
    const newOrder = new Order({
      orderDate,
      orderItems,
      onlineOrder,
      address,
      status,
      totalAmount,  // Store the total amount of the order
    });

    // Save the order
    await newOrder.save();

    return NextResponse.json({
      message: "Order created successfully",
      order: newOrder,
    }, { status: 201 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      message: "Error creating order",
      error: error.message,
    }, { status: 400 });
  }
}
