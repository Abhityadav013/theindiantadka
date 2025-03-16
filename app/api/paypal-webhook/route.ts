import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/libs/mongodb';
import Transaction from '@/app/models/Transaction';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

  interface PayPalAmount {
    value: string;
    currency_code: string;
  }
interface PayPalTransactionData {
  id: string; // PayPal transaction ID
  status: string; // Status of the payment (e.g., 'COMPLETED', 'PENDING', 'DENIED')
  amount: {
    total: string; // Total amount paid (as a string to handle currencies)
    currency_code: string; // Currency code (e.g., 'USD')
  };
  create_time: string; // Timestamp of the transaction creation (ISO 8601 format)
  custom?: string; // Optional custom metadata, if provided
  payer_id: string; // PayPal payer ID
  payment_method: string; // Payment method used (e.g., 'paypal', 'credit_card')
  paymentIntentId:string;
  paypal_fee: PayPalAmount;
}

async function getPaypalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials are not properly configured.');
  }

  const basicAuth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
  ).toString('base64');

  const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    throw new Error(
      'Failed to fetch access token. Status: ${tokenResponse.status}',
    );
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error('No access token received from PayPal.');
  }

  return { accessToken: tokenData.access_token, PAYPAL_BASE_URL };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyWebhookSignature(payload: any, headers: Headers) {
  const transmission_id = headers.get('paypal-transmission-id');
  const transmission_time = headers.get('paypal-transmission-time');
  const cert_url = headers.get('paypal-cert-url');
  const auth_algo = headers.get('paypal-auth-algo');
  const transmission_sig = headers.get('paypal-transmission-sig');

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID is not configured.');
  }

  const verifyPayload = {
    transmission_id,
    transmission_time,
    cert_url,
    auth_algo,
    transmission_sig,
    webhook_id: webhookId,
    webhook_event: payload,
  };

  const { accessToken, PAYPAL_BASE_URL } = await getPaypalAccessToken();

  const verifyResponse = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(verifyPayload),
    },
  );

  if (!verifyResponse.ok) {
    throw new Error(
      `Webhook signature verification failed. Status: ${verifyResponse.status}`,
    );
  }

  const verifyData = await verifyResponse.json();
  // Check if verification_status is 'SUCCESS'
  return verifyData.verification_status === 'SUCCESS';
}

export async function POST(request: NextRequest) {
  console.log(':::::::::::::::PAYPAL Transaction Started::::::::::');
  try {
    // Use request.text() to get the raw body as a string
    const payload = await request.json();
    console.log('Webhook payload received:', payload);

    const isVerified = await verifyWebhookSignature(payload, request.headers);
    if (!isVerified) {
      console.error('Webhook signature verification failed.');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 },
      );
    }

    console.log(
      ':::::::::::::::PAYPAL Transaction Step 4::::::::::',
      isVerified,
    );

    // Parse the webhook event
    const event = JSON.parse(payload);
    console.log(
      ':::::::::::::::PAYPAL Transaction Step 5::::::::::',
      event.event_type,
    );

    // Handle the event based on its type
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await storeTransaction(event.resource);
        break;
      case 'PAYMENT.SALE.PENDING':
        await storeTransaction(event.resource);
        break;
      case 'PAYMENT.SALE.DENIED':
        await storeTransaction(event.resource);
        break;
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}


const storeTransaction = async (
  paymentIntent: PayPalTransactionData,
) => {
  try {
    await connectToDatabase();  // Ensure DB connection
    const transaction = new Transaction({ // Generate a unique transaction ID
      paymentIntentId:paymentIntent.paymentIntentId,
      paymentProvider: 'paypal',
      amount: parseFloat(paymentIntent.amount.total),
      currency: paymentIntent.amount.currency_code,
      status: paymentIntent.status,
      created: paymentIntent.create_time,
      paypal: {
        capture_id:paymentIntent.id,
        capture_status: paymentIntent.status,
        fee: paymentIntent.paypal_fee,
      },
    }); 

    // Save the transaction to the database
    await transaction.save();

  } catch (error) {
    console.error('Error inserting transaction:', error);
  }
};
