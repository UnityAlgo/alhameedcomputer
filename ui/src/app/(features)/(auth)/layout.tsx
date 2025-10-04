import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
     <section className="bg-gray-50 text-gray-900">
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </section>
  );
}

