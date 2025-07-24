import { Schema, model, models, Model } from "mongoose";

export interface Favorite {
  _id?: string;
  toolId: string;
  userEmail: string;
  toolName: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<Favorite>(
  {
    toolId: { type: String, required: true },
    userEmail: { type: String, required: true },
    toolName: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
favoriteSchema.index({ userEmail: 1 });
favoriteSchema.index({ toolId: 1 });
favoriteSchema.index({ userEmail: 1, toolId: 1 }, { unique: true });

const FavoriteModel: Model<Favorite> =
  models.Favorite || model<Favorite>("Favorite", favoriteSchema);

export default FavoriteModel;
