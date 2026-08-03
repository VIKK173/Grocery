import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  active: boolean;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
