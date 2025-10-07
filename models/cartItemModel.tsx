import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      trim: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    productImage: {
      type: String,
    },
  }, // prevents separate _id for each item
);

if (mongoose.models.CartItem) {
  delete mongoose.models.CartItem;
}

export default mongoose.models.CartItem || mongoose.model("CartItem", CartItemSchema);