"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  UserRound,
} from "lucide-react";
import { useProfileQuery, useUpdateProfile } from "@/api/profile";
import { useUserQuery } from "./edit-profile/page";
import { Spinner } from "@/components/ui/spinner";

const Index = () => {
  const { data: profileData, isLoading } = useUserQuery();
  const [isEditing, setIsEditing] = useState(false);


  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    profile_picture: undefined as File | undefined,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        profile_picture: undefined,
      });
    }
  }, [profileData]);



  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Spinner /> Loading profile...</div>;
  }

  return (
    <div className="">

      <div className="py-6 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center space-x-4 space-y-4 sm:space-y-0">
          <div className="relative">
            <img src={profileData.image || "https://cdn-icons-png.flaticon.com/512/552/552721.png"} alt="" className="h-12 w-12" />


          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-base sm:text-lg">
              {profileData.full_name}
            </h3>
            <p className="text-black/80 text-xs sm:text-sm">
              {profileData.email}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900">
              Personal Information
            </h3>
          </div>

          <div className="space-y-6 sm:space-y-8 mt-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span
                className="text-gray-900 text-sm sm:text-base"
              >
                Member since { } {new Date(profileData?.created_at).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <UserRound className="h-4 w-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}

                  className="flex-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Last name"
                />
              ) : (
                <span className="text-gray-900 text-sm sm:text-base">
                  {formData.full_name}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 text-sm sm:text-base">
                {formData.email}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              ) : (
                <span className="text-gray-900 text-sm sm:text-base">
                  {formData.mobile}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
