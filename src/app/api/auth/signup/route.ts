import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'rivora-secret-key';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'user',
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      success: true,
      message: 'Signup successful!',
      user: userWithoutPassword,
      token,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
