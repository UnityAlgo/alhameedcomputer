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
import Image from "next/image";
import { useProfile, useUpdateProfile } from "@/api/profile";

const ProfilePage = () => {
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile_picture: undefined as File | undefined,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone_number: profileData.phone_number || "",
        profile_picture: undefined,
      });
    }
  }, [profileData]);

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const resetForm = () => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone_number: profileData.phone_number || "",
        profile_picture: undefined,
      });
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Personal details
        </h2>
      </div>

      <div className="p-4 sm:p-6 bg-gray-50 mb-6 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center space-x-4 space-y-4 sm:space-y-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-black/10 flex items-center justify-center">
              {formData.profile_picture ? (
                <Image
                  src={URL.createObjectURL(formData.profile_picture)}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : profileData?.profile_picture ? (
                <Image
                  src={profileData.profile_picture}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <UserRound className="h-8 w-8 text-gray-600" />
              )}
            </div>

            {isEditing && (
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({
                        ...formData,
                        profile_picture: e.target.files[0],
                      });
                    }
                  }}
                />
              </label>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-base sm:text-lg">
              {formData.full_name}
            </h3>
            <p className="text-black/80 text-xs sm:text-sm">
              {formData.email}
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

            <button
              onClick={() => {
                if (isEditing) {
                  resetForm();
                }
                setIsEditing(!isEditing);
              }}
              className="flex items-center space-x-2 px-2 py-2 text-blue-600 hover:underline rounded-lg transition-colors cursor-pointer"
            >
              {isEditing ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Edit3 className="h-3.5 w-3.5" />
              )}
              <span className="text-xs sm:text-sm">
                {isEditing ? "Cancel" : "Edit Profile"}
              </span>
            </button>
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
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
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
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              ) : (
                <span className="text-gray-900 text-sm sm:text-base">
                  {formData.phone_number}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="flex items-center space-x-2 bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span className="text-xs sm:text-sm">
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
