"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/api";
import { Spinner } from "@/components/ui/spinner";


const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: (payload: object) => {
      return axios.post(API_URL + "api/user/register", payload)
    }
  })
}


const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Pakistani phone number patterns:
  // +92XXXXXXXXXX (10 digits after +92)
  // 92XXXXXXXXXX (10 digits after 92)
  // 03XXXXXXXXX (11 digits starting with 03)
  const patterns = [
    /^\+92[3-9]\d{9}$/,
    /^92[3-9]\d{9}$/,
    /^0?3[0-9]\d{8}$/
  ];

  return patterns.some(pattern => pattern.test(cleaned));
};


const Index = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const mutation = useRegisterMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validatePhoneNumber(formData.get("phone_number") as string)) {
      setErrorMsg("Please enter a valid phone number (e.g., 03XX-XXXXXXX or +92XXX-XXXXXXX)");
      return;
    }

    const values = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone_number") as string,
      password: formData.get("password") as string,
    };

    mutation.mutate(values)
  };

  useEffect(() => {
    if (mutation.isError) {
      const error = mutation.error?.response?.data;
      if (error?.message) {
        setErrorMsg(error.message)
      }
      else if (typeof error === "object") {
        for (const key of Object.keys(error)) {
          if (error[key]?.[0]) {
            setErrorMsg(error[key]?.[0])
          }
        }
      }
      else {
        setErrorMsg("There was an issue while registering the user.")
      }
    }
    if (mutation.isSuccess) {
      toast.success("You’ve successfully registered. Welcome aboard!");
      router.push("/")
    }
  }, [mutation.isPending, mutation.isError])

  return (
    <div>
      {/* <Header /> */}

      <div className="max-w-[35rem] mx-auto">
        <div className="py-12">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">Create Your Account</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                  required
                  name="first_name"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                  required
                  name="last_name"
                />
              </div>
            </div>

            <div className="mb-2">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                required
                name="username"
              />
            </div>

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
                placeholder="Phone Number"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                required
                name="phone_number"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
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
                  mutation.isPending ? <Spinner color="light" size="md" /> : <span>Sign Up</span>
                }


              </button>
              <div className="text-center text-sm">
                Already have an Account?{" "}
                <Link href="/login" className="text-blue-700 font-medium">
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Index;