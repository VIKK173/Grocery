import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'rivora-secret-key';

function getUserFromToken(req: globalThis.Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(req: globalThis.Request) {
  try {
    await dbConnect();

    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let cart = await Cart.findOne({ userId: decoded.userId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ userId: decoded.userId, items: [] });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch cart';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: globalThis.Request) {
  try {
    await dbConnect();

    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let cart = await Cart.findOne({ userId: decoded.userId });
    if (!cart) {
      cart = await Cart.create({ userId: decoded.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await cart.populate('items.product');

    return NextResponse.json({ success: true, message: 'Added to cart!', cart: populatedCart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add to cart';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: globalThis.Request) {
  try {
    await dbConnect();

    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    const cart = await Cart.findOne({ userId: decoded.userId });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const item = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (item) item.quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await cart.populate('items.product');

    return NextResponse.json({ success: true, cart: populatedCart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update cart';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: globalThis.Request) {
  try {
    await dbConnect();

    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const cart = await Cart.findOne({ userId: decoded.userId });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    if (productId) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      cart.items = [];
    }

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await cart.populate('items.product');

    return NextResponse.json({ success: true, message: 'Item removed', cart: populatedCart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to remove from cart';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
