'use client'
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/index";

import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  LayoutDashboardIcon,
} from "lucide-react";

const ProfileSidebar = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const pathname = usePathname();

  const tabs = [
    { id: "overview", label: "Profile", icon: User, href: "/profile" },
    { id: "orders", label: "Orders", icon: Package, href: "/orders" },
    { id: "addresses", label: "Addresses", icon: MapPin, href: "/addresses" },
    { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
    { id: "logout", label: "Logout", icon: LogOut, action: handleLogout },
  ];

  return (
    <div className="overflow-hidden hide-scrollbar">
      <nav
        className="
          flex sm:flex-col 
          overflow-x-auto lg:overflow-visible 
          bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <h2
          className="flex justify-center items-center gap-2 sm:justify-start p-4 text-base font-semibold"
        >
          <LayoutDashboardIcon className="h-5 w-5 text-blue-600"/>
          Overview
        </h2>
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.id === "logout") {
            return (
              <button
                key={tab.id}
                onClick={tab.action}
                className="flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{tab.label}</span>
              </button>
            );
          }

          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.id}
              href={tab.href!}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors 
                ${isActive
                  ? "bg-blue-50 text-blue-700 border-b-2 sm:border-b-0 sm:border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;