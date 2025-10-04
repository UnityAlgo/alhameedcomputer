"use client";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useAddresses, useDeleteAddress } from "@/api/address";
import AddAddressForm from "./address-form";

const Index = () => {
  const { data: addresses = [] } = useAddresses();
  const deleteAddress = useDeleteAddress();

  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Saved Addresses</h2>
        <div className="hidden sm:block">
          <AddAddressForm
            open={isPopoverOpen}
            setOpen={setIsPopoverOpen}
            editingAddress={editingAddress}
            setEditingAddress={setEditingAddress}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {addresses.map((address: any) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-lg p-4 sm:p-6 relative"
          >
            {address.default && (
              <span className="absolute top-4 right-4 text-xs text-green-600">
                Default
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <span className="font-medium text-gray-900 capitalize">
                  {address.title}
                </span>
              </div>
            </div>
            <div className="text-gray-600 space-y-1 text-sm">
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
              <p>{address.phone_number}</p>
              <p>{address.email}</p>
            </div>
            <div className="mt-4 space-x-4 flex justify-end">
              <button
                className="text-blue-600 hover:underline text-sm flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  setEditingAddress(address);
                  setIsPopoverOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                className="text-red-600 hover:underline text-sm flex items-center gap-1 cursor-pointer"
                onClick={() => handleDelete(address.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end sm:hidden mt-4">
        <AddAddressForm
          open={isPopoverOpen}
          setOpen={setIsPopoverOpen}
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
        />
      </div>
    </div>
  );
};

export default Index;
