'use client'
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  LogOut,
} from "lucide-react";
import useAuthStore from "@/features/auth";

export const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Profile", icon: User, href: "/profile" },
    { id: "orders", label: "Orders", icon: Package, href: "/profile/orders" },
    { id: "addresses", label: "Addresses", icon: MapPin, href: "/profile/address" },
    { id: "logout", label: "Logout", icon: LogOut, action: logout },
  ];

  return (
    <div className="w-full">
      {/* Greeting Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Hello, {user.full_name || user.username}
        </h2>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex sm:flex-col overflow-x-auto sm:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            if (tab.id === "logout") {
              return (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 w-full whitespace-nowrap"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              );
            }

            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 sm:border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};