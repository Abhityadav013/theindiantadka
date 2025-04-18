import Contact from '@/app/models/Contact';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const tId = request.headers.get('tid') || '';
    const ssId = request.headers.get('session-id') || '';

    const { name, message } = payload;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required.' },
        { status: 400 },
      );
    }

    const contact = new Contact({
      name: name,
      message: message,
      deviceId: ssId,
      tid: tId,
    });

    // Save the order
    await contact.save();

    return NextResponse.json(
      {
        message: 'Request sent successfully',
        contact: contact,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
