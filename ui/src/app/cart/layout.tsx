"use client";

import { ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import useAuthStore from "@/features/auth";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";


const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Spinner />
        </div>
    )
}
export default function MainLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !isAuthenticated) {
            router.push("/login?redirect=/cart");
        }
    }, [hydrated, isAuthenticated]);

    if (!hydrated) {
        return <Loading />
    }


    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
}
