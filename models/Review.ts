import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
  productId: Schema.Types.ObjectId;
  changes: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  author: Schema.Types.ObjectId;
  adminId?: Schema.Types.ObjectId;
}

const ReviewSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  changes: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
