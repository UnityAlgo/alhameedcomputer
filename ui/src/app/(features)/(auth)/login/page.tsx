
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/api";
import axios from "axios";
import useAuthStore, { useLogin } from "@/features/auth";


export default function Index() {
  const router = useRouter();
  const authStore = useAuthStore();
  const mutation = useLogin(authStore);
  const [errorMsg, setErrorMsg] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      "email": form.get("email") as string,
      "password": form.get("password") as string,
    }

    mutation.mutate(payload);
  };
  useEffect(() => {
    if (mutation.isError) {
      const message = "Invalid login credentials"
      setErrorMsg(message);
      toast.error(message);
    }

    if (mutation.isSuccess) {
      setErrorMsg("");
      toast.success("Login successful");
      setTimeout(() => {
        // router.push("/");
      }, 300)
    }

  }, [mutation.isSuccess, mutation.isError])


  return (
    <div>

      <div className="max-w-[30rem] mx-auto py-12 px-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold mb-2">Login</h1>
          <p className="text-sm">Enter your email and password to securely access your account.</p>
        </div>


        <form onSubmit={handleSubmit}>
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
              type="text"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
              required
              name="password"
            />
          </div>


          <div>
            <div className="py-2 text-sm font-medium text-destructive">{errorMsg}</div>
            <button
              disabled={mutation.isPending}
              type="submit"
              className="bg-primary text-primary-foreground text-center w-full rounded-md py-2 mb-4 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Spinner color="light" size="md" /> : <span>Log In</span>}
            </button>
            <div className="text-center text-sm">
              Not have an Account? {" "}
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

