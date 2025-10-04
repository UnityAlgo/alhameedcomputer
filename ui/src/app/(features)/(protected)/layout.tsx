"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/index";
import { useRouter } from "next/navigation";
import { Header } from "../_layout/header";
import { Footer } from "../_layout/footer";
import { HeadLink } from "../_layout/head-link";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || (!isAuthenticated && !user)) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <header>
        <Header />
        <HeadLink />
      </header>
      <main className="min-h-screen w-full bg-gray-50">{children}</main>
      <footer className="border-t border-gray-200 p t-8">
        <Footer />
      </footer>
    </div>
  );
}
