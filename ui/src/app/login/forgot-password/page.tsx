"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import useAuthStore, { useLoginMutation } from "@/features/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/api";
import { useMutation } from "@tanstack/react-query";



const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await axios.post(`${API_URL}api/user/auth/forgot-password`, payload);
      return response.data;
    }
  })
}
export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const mutation = useForgotPasswordMutation();
  const [errorMsg, setErrorMsg] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      "email": form.get("email") as string,
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

          router.push("/login/forgot-password/verify?request_id=" + mutation.data.secret);
        
      }, 300)
    }

  }, [mutation.isSuccess, mutation.isError, mutation.data])


  return (
    <div>
      <Header />
      <div className="max-w-[30rem] min-h-[70vh] mx-auto py-12 px-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold mb-2">Forgot password</h1>
          <p className="text-sm">Enter your email to find your account.</p>
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


          <div>
            <div className="py-2 text-sm font-medium text-destructive">{errorMsg}</div>
            <button
              disabled={mutation.isPending}
              type="submit"
              className="bg-primary text-primary-foreground text-center w-full rounded-md py-2 mb-4 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Spinner color="light" size="md" /> : <span>Send</span>}
            </button>
            <div className="text-center text-sm">
              Back to  {" "}
              <Link href="/login" className="text-primary font-medium">
                Login
              </Link>
            </div>
          </div>
        </form>

      </div>
      <Footer />
    </div>
  );
}