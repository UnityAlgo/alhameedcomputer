"use client";
import React, { useState } from "react";
import { Lock, Save, Eye, EyeOff, ShieldCheck } from "lucide-react";

const Index = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const validateForm = () => {
    const newErrors = {
      current_password: "",
      new_password: "",
      confirm_password: "",
    };

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      
      alert("Password changed successfully!");
    } catch (error) {
      alert("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Change Password
        </h2>
      </div>

      <div className="p-4 sm:p-6 bg-gray-50 mb-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg">
              Security Settings
            </h3>
            <p className="text-black/80 text-xs sm:text-sm">
              Update your password to keep your account secure
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900">
              Password Information
            </h3>
          </div>

          <div className="space-y-6 sm:space-y-8 mt-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Lock className="h-4 w-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
              </div>
              <div className="ml-7 relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.current_password}
                  onChange={(e) =>
                    handleInputChange("current_password", e.target.value)
                  }
                  className={`w-full border ${
                    errors.current_password
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="ml-7 text-xs text-red-500">
                  {errors.current_password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Lock className="h-4 w-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
              </div>
              <div className="ml-7 relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.new_password}
                  onChange={(e) =>
                    handleInputChange("new_password", e.target.value)
                  }
                  className={`w-full border ${
                    errors.new_password ? "border-red-300" : "border-gray-300"
                  } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="ml-7 text-xs text-red-5 00">
                  {errors.new_password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Lock className="h-4 w-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
              </div>
              <div className="ml-7 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) =>
                    handleInputChange("confirm_password", e.target.value)
                  }
                  className={`w-full border ${
                    errors.confirm_password
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="ml-7 text-xs text-red-500">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">
                {isLoading ? "Updating..." : "Update Password"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;