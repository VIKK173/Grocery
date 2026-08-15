import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PATCH(
  req: globalThis.Request,
  { params }: { params: { orderId: string } }
) {
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
        console.warn('MongoDB connection failed:', mongoError);
        mongoAvailable = false;
      }
    }

    if (!mongoAvailable) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      }, { status: 503 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status is required' 
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status' 
      }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: params.orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: globalThis.Request,
  { params }: { params: { orderId: string } }
) {
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
        console.warn('MongoDB connection failed:', mongoError);
        mongoAvailable = false;
      }
    }

    if (!mongoAvailable) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      }, { status: 503 });
    }

    const order = await Order.findOneAndDelete({ orderId: params.orderId });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
