import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });

    return NextResponse.json({ success: true, message: 'Subscribed successfully! 🎉' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Subscription failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
