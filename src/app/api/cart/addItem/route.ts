// app/api/cart-item/route.ts
import { NextResponse } from "next/server";
import connect from "../../../../../dbConfig/dbConfig";
import CartItem from "../../../../../models/cartItemModel";

// GET /api/cart-item -> list all items
export async function GET() {
  try {
    await connect();
    const items = await CartItem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message ?? "Server error" }, { status: 500 });
  }
}

// POST /api/cart-item -> create one item and return created + all items
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    const {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      productImage,
    } = body;

    if (!productName || productPrice == null) {
      return NextResponse.json(
        { success: false, error: "productName and productPrice are required" },
        { status: 400 }
      );
    }

    const item = await CartItem.create({
      productName,
      productPrice,
      productQuantity: productQuantity ?? 1,
      productDescription,
      productImage,
    });

    // Fetch an updated list to return alongside the created item
    const items = await CartItem.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, item, items },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
