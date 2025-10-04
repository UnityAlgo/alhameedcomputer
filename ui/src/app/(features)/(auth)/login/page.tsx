
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLoginMutation } from "../_hooks/index";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.detail || "Invalid email or password");
        },
      }
    );
  };

  const handleSignupRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 md:w-96 md:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden w-full max-w-4xl">
          <div className="flex flex-col lg:flex-row md:min-h-[500px]">
            {/* <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-black to-red-600 p-2 lg:p-8 flex flex-col justify-between text-white relative overflow-hidden"> */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-100 to-white p-2 lg:p-8 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="sm:mb-4">
                  <Link href="/" className="flex-shrink-0  text-center">
                    <div className="h-20 md:h-30 flex items-center justify-center">
                      <img
                        src="/cover-logo.png"
                        alt="Al Hameed Computers"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </Link>
                </div>
                <div className="hidden lg:block mb-8">
                  <h2 className="text-gray-700 text-2xl font-bold mb-6 leading-tight">
                    Welcome to the AL Hameed Computers
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Offers all kinds of Gaming accessories and Gaming components in Karachi. Find gaming keyboards, mice, headsets, graphic cards, casings, and more at the best prices.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-500 text-sm ">Secure & Fast Checkout</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-300 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-500 text-sm ">Premium Quality Products</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-500 text-sm ">24/7 Customer Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 p-6 md:p-8 flex items-center">
              <div className="w-full max-w-md mx-auto">
                {/* <Link href="/" className="flex-shrink-0">
                  <div className="h-16 md:h-30 flex justify-center items-center">
                    <img
                      src="/logo.png"
                      alt="Al Hameed Computers"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </Link> */}
                <div className="text-center mb-8">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sign in to continue your shopping journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      autoComplete="current-email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-2 py-3 sm:pl-12 sm:pr-4 sm:py-4 border border-gray-200 rounded-lg sm:rounded-2xl focus:ring-0 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-lg text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-2 py-3 sm:pl-12 sm:pr-4 sm:py-4 border border-gray-200 rounded-lg sm:rounded-2xl focus:ring-0 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-lg text-gray-900 placeholder-gray-500 text-sm md:text-base"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <Eye className="w-4 h-4 sm:h-5 sm:w-5" />
                      ) : (
                        <EyeOff className="w-4 h-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-2 sm:py-4 rounded-lg sm:rounded-2xl font-semibold hover:from-black hover:to-gray-900 transition-all duration-200 flex items-center justify-center cursor-pointer text-sm sm:text-base space-x-2"
                  >
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-600 text-xs sm:text-base">
                    Don't have an account?{" "}
                    <button
                      onClick={handleSignupRedirect}
                      className="text-gray-900 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

