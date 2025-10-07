import { NextRequest, NextResponse } from "next/server";
import connect from "../../../../../dbConfig/dbConfig";
import Cart from "../../../../../models/cartModel";
import User from "../../../../../models/userModel";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cart = await Cart.findOne({ userId: user._id }).populate("items").lean();

    if (!cart) return NextResponse.json({ message: "Cart is empty" }, { status: 200 });

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
