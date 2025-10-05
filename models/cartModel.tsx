import mongoose from "mongoose";
import CartItemSchema from "./cartItemModel";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [CartItemSchema], // imported from separate file
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🧮 Automatically calculate total before saving

if (mongoose.models.Cart) {
  delete mongoose.models.Cart;
}

const Cart =mongoose.model("Cart", CartSchema)

export default Cart;
