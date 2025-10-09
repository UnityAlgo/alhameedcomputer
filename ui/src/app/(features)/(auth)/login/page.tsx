
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { login } from "@/store/authSlice";

const useLoginMutation = (dispatch?: Dispatch<UnknownAction>) => {
  return useMutation({
    mutationFn: (payload: object) => {
      return axios.post(API_URL + "api/login", payload);
    },
    onSuccess: (response) => {

      const payload = {
        tokens: response.data.tokens,
        user: response.data.user
      }
      dispatch?.(login(payload))

    }
  })
}


export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mutation = useLoginMutation(dispatch);
  const [errorMsg, setErrorMsg] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errorMsg) {
      setErrorMsg("");
    }

    const form = new FormData(event.target);

    const payload = {
      "email": form.get("email"),
      "password": form.get("password"),
    }
    mutation.mutate(payload);

  };

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("Successfully logged in!");
      router.push("/");
    }
    if (mutation.isError) {
      const message = mutation.error.response?.message || "Invalid login credentials"
      setErrorMsg(message);
      console.log(message)
      toast.error(message);
    }
  }, [mutation.isSuccess, mutation.isError])

  return (
    <div>

      <div className="max-w-[30rem] mx-auto py-12">
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
              {
                mutation.isPending ? <Spinner color="light" size="md" /> : <span>Log In</span>
              }


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

