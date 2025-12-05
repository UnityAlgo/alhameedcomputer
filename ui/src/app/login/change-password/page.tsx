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
import { PasswordInput } from "@/components/ui/password-input";
import { constrainedMemory } from "process";



const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: async (payload: { otp: string, secret: string }) => {
            const response = await axios.post(`${API_URL}/api/user/auth/forgot-password/reset-password`, payload);
            return response.data;
        }
    })
}
export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const mutation = useChangePasswordMutation();
    const [errorMsg, setErrorMsg] = useState("");
    const [values, setValues] = useState({
        new_password: "",
        confirm_password: ""
    });

    const secret = params.get("request_id") as string;

    // if (!secret) {
    //     router.push("/login");
    //     return
    // }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        console.log(event.currentTarget)

        const payload = {
            secret,
            new_password: values.new_password,
        }

        console.log(payload)
        mutation.mutate(payload);
    };


    useEffect(() => {


        if (mutation.isError) {
            setErrorMsg(mutation.error?.response?.data.message);
            toast.error(mutation.error?.response?.data.message as string);
        }

        if (mutation.isSuccess) {
            setErrorMsg("");

            toast.success("Password Changed Successfully");
            setTimeout(() => {
                router.push("/login");
            }, 300)
        }

    }, [mutation.isSuccess, mutation.isError])


    return (
        <div>
            <Header />
            <div className="max-w-[30rem] min-h-[70vh] mx-auto py-12 px-4">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold mb-2">Verify OTP</h1>
                    <p className="text-sm">Enter the OTP sent to your email.</p>
                </div>


                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="new_password">New Password</label>
                        <PasswordInput
                            placeholder="New Password"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                            required
                            onChange={(e) => setValues(prev => ({ ...prev, new_password: e.target.value }))}

                            name="new_password"
                        />
                    </div>
                    <div className="mb-2" >
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <PasswordInput
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                            required
                            onChange={(e) => setValues(prev => ({ ...prev, confirm_password: e.target.value }))}
                            name="confirm_password"
                        />
                    </div>


                    <div>
                        <div className="py-2 text-sm font-medium text-destructive">{errorMsg}</div>
                        <button
                            disabled={mutation.isPending}
                            type="submit"
                            className="bg-primary text-primary-foreground text-center w-full rounded-md py-2 mb-4 flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? <Spinner color="light" size="md" /> : <span>Verify </span>}
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