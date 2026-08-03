import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  unit: string;
  featured: boolean;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  badge: { type: String },
  badgeColor: { type: String },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  unit: { type: String, default: '1 pc' },
  featured: { type: Boolean, default: false },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
