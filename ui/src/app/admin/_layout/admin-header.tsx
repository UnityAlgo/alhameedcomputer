import Link from "next/link";
import { useAuth } from "@/hooks/index";
import { LogOut, User, UserRound } from "lucide-react";
import { useProfile } from "@/api/profile";
import Image from "next/image";


export const AdminHeader = () => {
    const { profileData } = useProfile();
    const { isAuthenticated, user, handleLogout } = useAuth();
    

return (
        <>
            <header className="border-b border-accent sticky top-0 z-50 bg-white">
                <div className="flex items-center justify-between max-w-6xl mx-auto px-2 md:px-4 py-2">
                    <Link href="/" className="flex-shrink-0">
                        <div className="h-10 md:h-12 flex items-center space-x-1">
                            <img
                                src="/logo.png"
                                alt="Al Hameed Computers"
                                className="h-full w-auto object-contain"
                            />
                            {/* <h3 className="font-bold text-lg">UnityAlgo</h3> */}
                        </div>
                    </Link>

                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-black/10 flex items-center justify-center">
                            {profileData?.profile_picture ? (
                                <Image
                                    src={profileData.profile_picture}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <UserRound className="h-4 w-4 text-gray-600" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Hello</p>
                            <div
                                className="relative cursor-pointer"
                            >
                                {isAuthenticated && user ? (
                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm font-medium text-gray-700 flex relative">
                                            {user.username}
                                            <div className="absolute right-[-15] top-1">
                                            </div>
                                        </span>
                                        {/* <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-1 text-sm font-medium transition-colors text-red-600 w-full text-left cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button> */}
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-gray-700">
                                        Sign in
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header >
        </>
    );
};

