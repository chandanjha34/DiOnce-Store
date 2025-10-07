// app/cart/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { RootState,AppDispatch } from "@/Redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { assignSignal } from "@/Redux/features/signal";

type CartItem = {
  _id: string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  productQuantity: number;
  productImage?: string;
  createdAt?: string;
};

export default function CartDashboard() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.username.value);
  const signal = useSelector((state: RootState) => state.signal.value);
  const dispatch = useDispatch<AppDispatch>();
  // Derived total
  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.productPrice * (it.productQuantity ?? 1), 0),
    [items]
  );

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/addItem", { cache: "no-store" });
      const data = await res.json();
      assignSignal('false');
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to fetch");
      setItems(data.items ?? []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchItems();
  }, []);

  // Form state
  const [form, setForm] = useState({
    productName: "",
    productPrice: "",
    productQuantity: "1",
    productDescription: "",
    productImage: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Inside CartDashboard

    const handleAddToCart = async (item: CartItem) => {
      try {
        const username = user; // Replace later with Redux user
        console.log(username)
        const payload = {
          username,
          cartDetails: {
            productName: item.productName,
            productDescription: item.productDescription,
            productPrice: item.productPrice,
            productQuantity: item.productQuantity ?? 1,
            productImage: item.productImage,
          },
        };
        console.log(payload)
        const res = await fetch("/api/cart/addItemtoCart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    console.log(data);
    if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to add item to cart");
    dispatch(assignSignal('k'));
    alert("✅ Item added to cart successfully!");

  } catch (err) {
    console.error(err);
    alert("❌ Failed to add to cart");
  }
};



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        productName: form.productName.trim(),
        productPrice: Number(form.productPrice),
        productQuantity: Number(form.productQuantity || 1),
        productDescription: form.productDescription.trim() || undefined,
        productImage: form.productImage.trim() || undefined,
      };
      const res = await fetch("/api/cart/addItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to create");
      setItems(data.items ?? []); // server returns refreshed list
      setOpen(false);
      setForm({ productName: "", productPrice: "", productQuantity: "1", productDescription: "", productImage: "" });
    } catch (error) {
      alert(error ?? "Failed to create");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Cart Dashboard</h1>
          <div className="text-gray-600">Total Items: {items.length}</div>
        </header>

        {loading ? (
          <div className="text-gray-500">Loading items…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">No items yet. Add one with the plus button.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((it) => (
              <li key={it._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex gap-4">
                  {it.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.productImage} alt={it.productName} className="h-20 w-20 rounded object-cover" />
                  ) : (
                    <div className="h-20 w-20 rounded bg-gray-200" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{it.productName}</h3>
                      <span className="text-sm text-gray-600">x{it.productQuantity ?? 1}</span>
                    </div>
                    {it.productDescription && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{it.productDescription}</p>
                    )}
                    <div className="mt-2 font-semibold flex justify-between">
                        ${it.productPrice.toFixed(2)}
                       <button
                          onClick={() => handleAddToCart(it)}
                          className="border border-black rounded-lg p-1 hover:bg-gray-700 text-white"
                        >
                          Add to Cart
                        </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating + button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white text-3xl shadow-lg hover:bg-gray-800"
        aria-label="Add cart item"
      >
        +
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Cart Item</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black">
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product name</label>
                <input
                  name="productName"
                  value={form.productName}
                  onChange={onChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    name="productPrice"
                    type="number"
                    step="0.01"
                    value={form.productPrice}
                    onChange={onChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    name="productQuantity"
                    type="number"
                    min={1}
                    value={form.productQuantity}
                    onChange={onChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  name="productImage"
                  value={form.productImage}
                  onChange={onChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder="https://…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="productDescription"
                  value={form.productDescription}
                  onChange={onChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded border px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="rounded bg-black px-4 py-2 text-white">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
