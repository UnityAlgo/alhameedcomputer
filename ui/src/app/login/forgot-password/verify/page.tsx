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



const useVerificationMutation = () => {
    return useMutation({
        mutationFn: async (payload: { otp: string, secret: string }) => {
            const response = await axios.post(`${API_URL}/api/user/auth/forgot-password/verify`, payload);
            return response.data;
        }
    })
}
export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const mutation = useVerificationMutation();
    const [errorMsg, setErrorMsg] = useState("");

    const secret = params.get("request_id") as string;

    if (!secret) {
        router.push("/login");
        return
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        const payload = {
            otp: form.get("otp") as string,
            secret
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
            toast.success("OTP Verified Successfully");

            setTimeout(() => {
                router.push("/login/change-password?request_id=" + secret);
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
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                            required
                            name="otp"
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