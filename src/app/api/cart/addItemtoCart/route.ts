import { NextRequest, NextResponse } from "next/server";
import connect from "../../../../../dbConfig/dbConfig";
import Cart from "../../../../../models/cartModel";
import User from "../../../../../models/userModel";
import CartItem from "../../../../../models/cartItemModel";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { username, cartDetails } = await req.json();

    if (!username || !cartDetails?.productName) {
      return NextResponse.json({ error: "Username and product details required" }, { status: 400 });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2️⃣ Find or create cart item
    let cartItem = await CartItem.findOne({ productName: cartDetails.productName });
    console.log('checkpoint 1')
    if (!cartItem) {
      cartItem = await CartItem.create({
        productName: cartDetails.productName,
        productPrice: cartDetails.productPrice,
        productQuantity: cartDetails.productQuantity ?? 1,
        productDescription: cartDetails.productDescription,
        productImage: cartDetails.productImage,
      });
    }
    console.log('checkpoint 1')
    // 3️⃣ Find or create cart
    let cart = await Cart.findOne({ userId: user._id });
        console.log('checkpoint 1')
        console.log(cart);
    if (!cart) {
          console.log('checkpoint 2')
      cart = new Cart({ userId: user._id, items: [cartItem._id] });
    } else {
            console.log('checkpoint 2')
        cart.items.push(cartItem._id);
    }

    await cart.save();
    console.log(cart);
    const updatedCart = await Cart.findOne({ userId: user._id })
      .populate("items")
      .lean();

    return NextResponse.json({ success: true, cart: updatedCart }, { status: 201 });
  } catch (error) {
    console.error("Error in add-to-cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
