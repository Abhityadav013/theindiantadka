import { connectToDatabase } from '@/app/libs/mongodb';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  console.log(':::::::::::::::WebHook Endpoint request Recieved::::::::::')
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event;

  try {
    // Verify the webhook signature to make sure it's from Stripe
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret); // Use constructEvent, not constructEventAsync
  } catch (err) {
    console.error('Error verifying webhook signature', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(':::::::::::::::WebHook Event succeeded::::::::::')
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      await storeTransaction(paymentIntentSucceeded, 'succeeded');
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      await storeTransaction(paymentIntentFailed, 'failed');
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const verify = url.searchParams.get('verify');

  if (verify === 'true') {
    return NextResponse.json({ message: 'Webhook verified' });
  }

  return NextResponse.json({ message: 'Webhook is live' });
}


const storeTransaction = async (
  paymentIntent: Stripe.PaymentIntent,
  status: string,
) => {
  const db = await connectToDatabase(); // Ensure DB connection
  if (!db) {
    console.error('Database connection failed');
    return;
  }

  try {
    const transaction = {
      paymentProvider: 'Stripe', 
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount_received /100,
      currency: paymentIntent.currency,
      status,
      created: new Date(paymentIntent.created * 1000), // Convert timestamp
      metadata: paymentIntent.metadata,
    };

    const collection = db.collection('OrderTransaction');
    await collection.insertOne(transaction);
    console.log('Transaction inserted successfully:', transaction);
  } catch (error) {
    console.error('Error inserting transaction:', error);
  }
};
