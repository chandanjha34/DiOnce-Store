"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";

interface CartItem {
  _id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage?: string;
}

interface CartData {
  _id: string;
  items: CartItem[];
}

const CartPage = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = useSelector((state: RootState) => state.username.value);
  const signal = useSelector((state: RootState) => state.signal.value);

  useEffect(() => {
    if (!username) return;

    const fetchCart = async () => {
        console.log(JSON.stringify({ username }));
      try {
        setLoading(true);
        const res = await fetch("/api/cart/View", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch cart");

        setCart(data.cart);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [signal,username]);

  if (loading) return <div className="text-center text-gray-400 mt-10">Loading cart...</div>;
  if (error) return <div className="text-center text-red-400 mt-10">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <p className="text-xl">🛒 Your cart is empty.</p>
        <p className="text-sm mt-2">Add something to get started!</p>
      </div>
    );

  const total = cart.items.reduce(
    (sum, item) => sum + item.productPrice * item.productQuantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-4 text-center">🛒 Your Cart</h1>
      <p className="text-center text-gray-300 mb-6">Total: ${total.toFixed(2)}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:shadow-lg hover:scale-[1.01] transition-all"
          >
            {item.productImage && (
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">
              {item.productName}
            </h2>
            <p className="text-gray-300 mb-1">Quantity: {item.productQuantity}</p>
            <p className="text-gray-300 mb-1">Price: ${item.productPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
