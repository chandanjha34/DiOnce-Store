"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"], // bold for the brand
  variable: "--font-brand",
});

const Navbar = () => {
  const route = useRouter();
  const username = useSelector((state: RootState) => state.username.value);
  const handleSignInRoute = () => {
    route.push("/signup");
  };

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left - Logo */}
        <div
          className={`${montserrat.className} text-xl font-bold tracking-wide text-gray-900 select-none`}
          title="DiOnce Store"
        >
          DiOnce Store
        </div>

        {/* Middle - Search */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search products, brands, and more…"
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-2 pr-10 text-sm text-gray-800 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          </div>
        </div>

        {/* Right - Category, Cart, Profile */}
        <div className="flex items-center gap-6">
          <button className="text-sm text-gray-700 transition hover:text-gray-900">Category</button>

          <button
            className="relative grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            aria-label="Open cart"
          >
            <Image className="h-5 w-5" width={20} height={20} src="/asset/cart.png" alt="cart" />
            {/* Optional badge
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[10px] font-semibold text-white">3</span>
            */}
          </button>

          <button
            onClick={handleSignInRoute}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            aria-label="Profile"
          >
            <Image className="h-6 w-6 rounded-full" width={24} height={24} src="/asset/profile.png" alt="profile" />
            <span className="hidden sm:inline">{username?username:'Sign in'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
