import { Schema, model, models, Model } from "mongoose";

export interface Review {
  _id?: string;
  toolId: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment?: string;
  toolName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<Review>(
  {
    toolId: { type: String, required: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true }, // Added
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    toolName: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
reviewSchema.index({ toolId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ userEmail: 1 }); // Added
reviewSchema.index({ toolId: 1, userId: 1 }, { unique: true });

const ReviewModel: Model<Review> =
  models.Review || model<Review>("Review", reviewSchema);

export default ReviewModel;
