import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getUser } from "@/app/lib/auth";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  console.log("user", user);

  return (
    <div>
      <Header />
      <main className="min-h-screen w-full bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}