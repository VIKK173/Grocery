import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, index: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
