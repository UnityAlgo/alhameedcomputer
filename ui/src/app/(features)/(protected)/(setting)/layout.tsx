import { ReactNode } from "react";
import ProfileSidebar from "../../../../components/products/profile-sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-6xl mx-auto px-2 md:px-4 py-4 bg-gray-50 grid grid-cols-1 sm:grid-cols-6 gap-4">
      <div className="col-span-1 sm:col-span-2">
        <ProfileSidebar />
      </div>
      <div className="col-span-1 sm:col-span-4 w-full bg-white rounded-lg shadow-sm border border-gray-200">{children}</div>
    </main>
  );
}
