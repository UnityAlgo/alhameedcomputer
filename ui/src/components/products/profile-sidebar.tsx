'use client'
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
} from "lucide-react";
import useAuthStore from "@/features/auth";
import { cn } from "@/utils";

export const Sidebar = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const rows = [
    {
      label: "Manage My Account", icon: User, href: "/profile",
      childrens: [
        { label: "My Profile", href: "/profile" },
        { label: "Edit Profile", href: "/profile/edit-profile" },
        { label: "Change Password", href: "/profile/change-password" },
        { label: "Address Book", href: "/profile/address" },
      ]
    },
    {
      id: "orders", label: "My Orders", icon: Package, href: "/profile/orders",
      childrens: [
        { label: "Pending Orders", href: "/profile/orders?status=pending" },
        { label: "My Returns", href: "/profile/orders?status=returned" },
        { label: "My Cancellations", href: "/profile/orders?status=cancelled" },
      ]
    },
  ];

  return (
    <div className="w-full px-4 py-6">

      <div className="mb-4">
        <h2 className="text-base font-semibold">
          Hello, {user.full_name || user.username}
        </h2>
      </div>

      <nav className="overflow-hidden">
        <div className="flex sm:flex-col overflow-x-auto sm:overflow-visible">
          {rows.map((i, idx) => {
            const Icon = i.icon;
            const isActive = pathname === i.href;

            return (
              <div className="py-2" key={idx}
              >
                <div
                  className={cn("flex items-center gap-2 p-2 py-1 text-sm font-medium transition-colors whitespace-nowrap rounded-md",
                    isActive
                      ? "text-blue-700"
                      : "",
                    i.childrens ? "hover:bg-accent" : ""
                  )}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span>{i.label}</span>
                </div>
                {i.childrens && (
                  <div className="ml-6 mt-1 ">
                    {i.childrens.map((child, j) => (
                      <Link key={j} className="block text-xs py-1 px-2 hover:bg-accent rounded-md" href={child.href}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};