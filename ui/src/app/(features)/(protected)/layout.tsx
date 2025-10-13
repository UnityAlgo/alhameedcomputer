"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/index";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
// import { cookies } from 'next/headers'


export default async function Layout({ children }: { children: React.ReactNode }) {
  // const { isAuthenticated, user } = useAuth();
  // const router = useRouter();

  // const cookieStore = await cookies();
  // cookieStore.get()

  // if (!isAuthenticated) {
  //   router.replace("/login");
  // }

  // // useEffect(() => {
  // //   if (!isAuthenticated) {
  // //     router.replace("/login");
  // //   }
  // // }, [isAuthenticated, router]);

  // // if (!isAuthenticated || !user) {
  // //   return (
  // //     <div className="h-screen flex items-center justify-center">
  // //       <div className="text-gray-600">Loading...</div>
  // //     </div>
  // //   );
  // // }

  return (
    <div>
      <Header />
      <main className="min-h-screen w-full bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}