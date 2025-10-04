import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/index";

import Link from "next/link";
import {
    Package,
    MapPin,
    UserRound,
    LogOut,
    LayoutDashboardIcon,
} from "lucide-react";

const AdminSidebar = () => {
    const { isAuthenticated, user, handleLogout } = useAuth();
    const pathname = usePathname();

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: UserRound, href: "/admin" },
        { id: "orders", label: "Orders", icon: Package, href: "/admin/orders" },
        { id: "products", label: "Products", icon: MapPin, href: "/admin/products" },
        { id: "category", label: "Category", icon: MapPin, href: "/admin/category" },
        { id: "brands", label: "Brands", icon: MapPin, href: "/admin/brands" },
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
                    className="flex justify-center items-center gap-2 text-center p-4 text-base font-semibold"
                >
                    {/* <LayoutDashboardIcon className="h-5 w-5 text-red-900"/> */}
                    <img src="/logo.png" className="h-7 w-7" />
                    Admin Panel
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

export default AdminSidebar;