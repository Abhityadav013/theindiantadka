import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/app/libs/mongodb';
import Transaction from '@/app/models/Transaction';

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;

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
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>; // PayPal links (usually for follow-up actions like approval, cancel, etc.)
}

export async function POST(request: NextRequest) {
  console.log(':::::::::::::::PAYPAL Transaction Started::::::::::')
  try {
    // Use request.text() to get the raw body as a string
    const body = await request.text();
    console.log(':::::::::::::::PAYPAL Transaction Step 1::::::::::')

    // PayPal webhook signature verification
    const paypalSignature = request.headers.get('paypal-auth-algo');
    const paypalTransmissionSig = request.headers.get('paypal-transmission-sig');
    console.log(':::::::::::::::PAYPAL Transaction Step 2::::::::::',paypalSignature,paypalTransmissionSig)

    if (!paypalSignature || !paypalTransmissionSig) {
      return NextResponse.json(
        { error: 'Missing PayPal headers' },
        { status: 400 }
      );
    }
    
    console.log(':::::::::::::::PAYPAL Transaction Step 3::::::::::')
    const verifySignature = verifyPayPalSignature(
      body,
      paypalSignature,
      paypalTransmissionSig
    );

    console.log(':::::::::::::::PAYPAL Transaction Step 4::::::::::',verifySignature)
    if (!verifySignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the webhook event
    const event = JSON.parse(body);
    console.log(':::::::::::::::PAYPAL Transaction Step 5::::::::::',event.event_type)
    
    // Handle the event based on its type
    switch (event.event_type) {
      case 'PAYMENT.SALE.COMPLETED':
        await storeTransaction(event.resource, 'succeeded');
        break;
      case 'PAYMENT.SALE.PENDING':
        await storeTransaction(event.resource, 'pending');
        break;
      case 'PAYMENT.SALE.DENIED':
        await storeTransaction(event.resource, 'failed');
        break;
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function verifyPayPalSignature(
  body: string,
  paypalSignature: string,
  paypalTransmissionSig: string
): boolean {
  const signatureVerificationString = `${paypalSignature}|${paypalTransmissionSig}|${body}`;
  const hmac = crypto.createHmac('sha256', PAYPAL_CLIENT_SECRET);
  hmac.update(signatureVerificationString);
  const computedSignature = hmac.digest('hex');

  return computedSignature === paypalTransmissionSig;
}

const storeTransaction = async (
  transactionData: PayPalTransactionData,
  status: string
) => {
  const db = await connectToDatabase();
  if (!db) {
    console.error('Database connection failed');
    return;
  }

  try {
    const transaction = {
      paymentProvider: 'PayPal',
      paymentIntentId: transactionData.id, // PayPal's transaction ID
      amount: transactionData.amount.total,
      currency: transactionData.amount.currency_code,
      status,
      created: new Date(transactionData.create_time), // Convert timestamp
      metadata: transactionData.custom, // If you have metadata
    };

    const collection = db.collection('OrderTransaction');
    await collection.insertOne(transaction);
    console.log('Transaction inserted successfully:', transaction);
  } catch (error) {
    console.error('Error inserting transaction:', error);
  }

    try {
  
      await connectToDatabase();  // Ensure DB connection
      const transaction = new Transaction({ // Generate a unique transaction ID
        paymentProvider: 'PayPal',
        paymentIntentId: transactionData.id,
        amount: transactionData.amount.total,  // Convert from cents
        currency: transactionData.amount.currency_code,
        status,
        created:new Date(transactionData.create_time), // Convert timestamp
        metadata:transactionData.custom,
      });
  
      console.log(':::::::::::::::Order Transaction Model Created Completed::::::::::')
      // Save the transaction to the database
      await transaction.save();
      
      console.log('Transaction inserted successfully:', transaction);
    } catch (error) {
      console.error('Error inserting transaction:', error);
    }
};
