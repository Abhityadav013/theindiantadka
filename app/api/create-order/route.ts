/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItem } from '@/app/utils/types/order_type';
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;

export async function POST(request: NextRequest) {
  try {  
    // Get amount and order from the request body
    const { amount, order } = await request.json();
    // Calculate the order total by summing the prices of all items in the order
    const orderTotal = order.reduce((total: number, item: OrderItem) => total + parseFloat((parseFloat(item.unit_amount.value) * item.quantity).toFixed(2)), 0);
    // Calculate the shipping amount by subtracting the order total from the total amount
    const shippingAmount = parseFloat((amount / 100).toFixed(2)) - orderTotal; // Convert amount to dollars and subtract the order total
    // Ensure the shipping amount is not negative
    const shipping = shippingAmount > 0 ? shippingAmount : 0;

    // Construct the base request body for PayPal
    const requestBody: any = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            value: (amount / 100).toFixed(2), // PayPal uses dollars, so divide by 100 if you pass in cents
            currency_code: 'USD',
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: orderTotal.toFixed(2) // Total amount for items
              }
            },
          },
          items: order, // The items in the order
        },
      ],
      application_context: {
        return_url: `http://localhost:3000/payment-success`,
        cancel_url: `http://localhost:3000/payment-cancel`,
      },
    };

    // Add shipping only if there's a shipping amount (i.e., orderTotal and amount are not the same)
    if (shipping > 0) {
      requestBody.purchase_units[0].amount.breakdown.shipping = {
        currency_code: "USD",
        value: shipping.toFixed(2), // Add the calculated shipping amount
      };
    }

    // Make the PayPal API request
    const response = await fetch(
      process.env.NEXT_PUBLIC_PAYPAL_BASE_URL + '/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Parse the response from PayPal
    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ id: data.id });
    } else {
      throw new Error(data.message || 'Failed to create PayPal order');
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
