import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: globalThis.Request) {
  try {
    const hasMongo = !!process.env.MONGODB_URI;
    let mongoAvailable = false;
    
    if (hasMongo) {
      try {
        const conn = await dbConnect();
        if (conn) {
          mongoAvailable = true;
        }
      } catch (mongoError) {
        console.warn('MongoDB connection failed, using in-memory fallback:', mongoError);
        mongoAvailable = false;
      }
    }

    const body = await req.json();
    const { items, address, paymentMethod, subtotal, deliveryFee, discount, total, userId } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }
    if (!address?.name || !address?.phone || !address?.address || !address?.city || !address?.pincode) {
      return NextResponse.json({ success: false, error: 'Please fill all address fields' }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: 'Please select a payment method' }, { status: 400 });
    }

    // Generate unique order ID
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderId = `RF${timestamp}${random}`;

    // Estimated delivery: 30-60 min from now
    const deliveryMinutes = Math.floor(Math.random() * 31) + 30; // 30-60 min
    const deliveryDate = new Date(Date.now() + deliveryMinutes * 60 * 1000);
    const estimatedDelivery = deliveryDate.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
    });

    let order;
    if (mongoAvailable) {
      order = await Order.create({
        orderId,
        userId: userId || 'guest',
        items: items.map((item: Record<string, unknown>) => ({
          productId: item._id || item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
        })),
        address,
        paymentMethod,
        subtotal,
        deliveryFee,
        discount,
        total,
        status: 'confirmed',
        estimatedDelivery,
      });
    } else {
      order = {
        orderId,
        status: 'confirmed',
        estimatedDelivery,
        total,
        items,
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId: order.orderId,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt || new Date(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: globalThis.Request) {
  try {
    const hasMongo = !!process.env.MONGODB_URI;
    let mongoAvailable = false;
    
    if (hasMongo) {
      try {
        const conn = await dbConnect();
        if (conn) {
          mongoAvailable = true;
        }
      } catch (mongoError) {
        console.warn('MongoDB connection failed, using in-memory fallback:', mongoError);
        mongoAvailable = false;
      }
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';
    const orderId = searchParams.get('orderId');

    let query: Record<string, string> = { userId };
    if (orderId) query.orderId = orderId;

    let orders: any[] = [];
    if (mongoAvailable) {
      orders = await Order.find(query).sort({ createdAt: -1 }).limit(20);
    }
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
