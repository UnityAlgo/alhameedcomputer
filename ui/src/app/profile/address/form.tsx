"use client";

import React, { useState } from "react";
import { MapPin, Mail, Phone, Home, Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";
import { Input } from "@/components/ui/input";
import { TypeAddress } from "@/api/address";

type AddressFormData = {
  title: string;
  default: boolean;
  address_type: string;
  address_line_1: string;
  address_line_2: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  email: string;
  phone_number: string;
};

type AddressFormProps = {
  onSubmit: (data: TypeAddress) => void;
  initialData?: Partial<TypeAddress>;
  isLoading?: boolean;
};

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "UAE",
];

const PAKISTAN_STATES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
  "Islamabad Capital Territory",
];

const ADDRESS_TYPES = [
  { value: "home", label: "Home", icon: Home },
  { value: "office", label: "Office", icon: Building2 },
  { value: "other", label: "Other", icon: MapPin },
];

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {


  const [formData, setFormData] = useState<TypeAddress>(() => ({
    title: initialData?.title || "",
    default: initialData?.default || false,
    address_type: initialData?.address_type || "home",
    address_line_1: initialData?.address_line_1 || "",
    address_line_2: initialData?.address_line_2 || "",
    country: initialData?.country || "Pakistan",
    state: initialData?.state || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = "Address line 1 is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    }


    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (formData.phone_number && !/^[+]?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium block">
          Address Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          placeholder="e.g., Home, Office, etc."
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block">
          Address Type
        </label>

        <div className="grid grid-cols-3 gap-3">
          {ADDRESS_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange("address_type", type.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${formData.address_type === type.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${formData.address_type === type.value ? "text-blue-600" : "text-gray-600"
                  }`} />
                <span className={`text-sm font-medium ${formData.address_type === type.value ? "text-blue-600" : "text-gray-700"
                  }`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="address_line_1" className="text-sm font-medium block">
          Address Line 1 <span className="text-destructive">*</span>
        </label>
        <Input
          id="address_line_1"
          placeholder="House/Flat No., Building Name, Street"
          value={formData.address_line_1}
          onChange={(e) => handleChange("address_line_1", e.target.value)}
          className={cn(errors.address_line_1 ? "border-destructive" : "")}
        />
        {errors.address_line_1 && (
          <p className="text-destructive text-xs mt-1">{errors.address_line_1}</p>
        )}
      </div>

      <div>
        <label htmlFor="address_line_2" className="text-sm font-medium block">
          Address Line 2 (Optional)
        </label>
        <Input
          id="address_line_2"
          placeholder="Area, Landmark, etc."
          value={formData.address_line_2}
          onChange={(e) => handleChange("address_line_2", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="text-sm font-medium block">
            Country <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.country}
            onValueChange={(value: string) => handleChange("country", value)}
            defaultValue={"Pakistan"}
            disabled={true}
          >
            <SelectTrigger >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="state" className="text-sm font-medium block">
            State/Province <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.state}
            onValueChange={(value: string) => handleChange("state", value)}
          >
            <SelectTrigger className={errors.state ? "border-destructive" : ""}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {PAKISTAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="text-sm font-medium block">
            City <span className="text-destructive">*</span>
          </label>
          <Input
            id="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={cn(errors.city ? "border-destructive" : "")}
          />
          {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="postal_code" className="text-sm font-medium block">
            Postal Code <span className="text-destructive">*</span>
          </label>
          <Input
            id="postal_code"
            placeholder="Enter postal code"
            value={formData.postal_code}
            onChange={(e) => handleChange("postal_code", e.target.value)}
            className={errors.postal_code ? "border-destructive" : ""}
          />
          {errors.postal_code && (
            <p className="text-destructive text-xs mt-1">{errors.postal_code}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium block">
            Email (Optional)
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={cn(errors.email ? "border-destructive" : "")}
            />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              id="phone_number"
              type="tel"
              placeholder="+92 300 1234567"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              className={cn(errors.phone_number ? "border-destructive" : "")}
            />
          </div>
          {errors.phone_number && (
            <p className="text-destructive text-xs mt-1">{errors.phone_number}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="default"
          checked={formData.default}
          onCheckedChange={(checked) => handleChange("default", checked as boolean)}
        />
        <label
          htmlFor="default"
          className="text-sm font-medium cursor-pointer"
        >
          Set as default address
        </label>
      </div>


      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Address
          </>
        )}
      </Button>
    </form>
  );
};