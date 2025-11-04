import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { validateAuth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Validate authentication on the server
  const user = await validateAuth();

  // Redirect to login if not authenticated
  // if (!user) {
  //   redirect('/login');
  // }

  return (
    <div>
      <Header />
      <main className="min-h-screen w-full bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}
