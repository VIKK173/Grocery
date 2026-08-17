import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// Access global in-memory storage from main orders route
const getInMemoryOrders = () => {
  if (typeof global !== 'undefined') {
    return (global as any).inMemoryOrders || [];
  }
  return [];
};

const setInMemoryOrders = (orders: any[]) => {
  if (typeof global !== 'undefined') {
    (global as any).inMemoryOrders = orders;
  }
};

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
        console.warn('MongoDB connection failed, using in-memory:', mongoError);
        mongoAvailable = false;
      }
    }

    const body = await req.json();
    const { status, assignedWorker } = body;

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (assignedWorker !== undefined) updateData.assignedWorker = assignedWorker;

    if (mongoAvailable) {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
      if (status && !validStatuses.includes(status)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid status' 
        }, { status: 400 });
      }

      const order = await Order.findOneAndUpdate(
        { orderId: params.orderId },
        updateData,
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
    } else {
      // In-memory fallback
      const orders = getInMemoryOrders();
      const orderIndex = orders.findIndex(o => o.orderId === params.orderId);
      if (orderIndex === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Order not found' 
        }, { status: 404 });
      }

      orders[orderIndex] = { ...orders[orderIndex], ...updateData };
      setInMemoryOrders(orders);

      return NextResponse.json({ 
        success: true, 
        order: orders[orderIndex] 
      });
    }
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
