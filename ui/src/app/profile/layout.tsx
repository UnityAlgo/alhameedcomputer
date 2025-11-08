"use client";


import { ReactNode, useEffect } from "react";
import { Sidebar } from "../../components/products/profile-sidebar";
import useAuthStore from "@/features/auth";
import { useRouter } from 'next/navigation';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authStore = useAuthStore();

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, []);


  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-2 md:px-4 py-4 grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-1 sm:col-span-4 w-full bg-white rounded-lg shadow-sm border border-gray-200 min-h-[60vh]">{children}</div>
      </main>
      <Footer />
    </>
  );
}
