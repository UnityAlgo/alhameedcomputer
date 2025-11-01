"use client";

import React from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/app/lib/login";
import { useActionState } from "react";

export default function Index() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="min-h-[70vh]">
      <div className="max-w-[30rem] mx-auto py-12 px-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold mb-2">Login</h1>
          <p className="text-sm">Enter your email and password to securely access your account.</p>
        </div>

        <form action={formAction}>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
              required
              name="email"
            />
          </div>

          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
              required
              name="password"
            />
          </div>

          <div>
            {state && !state.success && (
              <div className="py-2 text-sm font-medium text-destructive">
                {state.error}
              </div>
            )}
            <button
              disabled={pending}
              type="submit"
              className="bg-primary text-primary-foreground text-center w-full rounded-md py-2 mb-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {pending ? <Spinner color="light" size="md" /> : <span>Log In</span>}
            </button>
            <div className="text-center text-sm">
              Not have an Account?{" "}
              <Link href="/register" className="text-blue-700 font-medium">
                Register your account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}