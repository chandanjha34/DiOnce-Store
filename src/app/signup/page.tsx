"use client";
import { useRouter } from "next/navigation";
import { doSocialLogin } from "../actions/index";
import { useState } from "react";
import { assignUsername } from "@/Redux/features/username";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/store";

const LoginForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        dispatch(assignUsername(data.username));        
        alert(isSignup ? "✅ Signup successful! You can now log in." : "✅ Login successful!");
        router.push('/')
      } else {
        alert(`❌ ${data?.message || "Something went wrong."}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl p-8 border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Email + Password Form */}
        <form onSubmit={handleAuth} className="flex flex-col space-y-4 mb-6">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none text-white placeholder-white/70"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none text-white placeholder-white/70"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none text-white placeholder-white/70"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500" : "bg-pink-500 hover:bg-pink-600"
            } text-white font-semibold py-3 rounded-lg transition-all`}
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-white/30" />
          <span className="px-3 text-white/70 text-sm">OR</span>
          <hr className="flex-grow border-white/30" />
        </div>

        {/* Social Login */}
        <form action={doSocialLogin} className="flex flex-col gap-3">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-lg font-medium transition-all"
            type="submit"
            name="action"
            value="google"
          >
            Continue with Google
          </button>

          <button
            className="bg-gray-900 hover:bg-black text-white py-3 rounded-lg text-lg font-medium transition-all"
            type="submit"
            name="action"
            value="github"
          >
            Continue with GitHub
          </button>
        </form>

        {/* Toggle Between Login & Signup */}
        <p className="text-center text-sm mt-6 text-white/80">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            className="text-pink-400 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
