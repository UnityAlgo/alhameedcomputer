"use client";
import { CheckCircle2, Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import React from "react";
import { TypeAddress, useAddressQuery } from "@/api/address";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Index = () => {
  const { data } = useAddressQuery({ enabled: true });

  if (!data?.length) {

    return (
      <div>
        <div className="text-center py-16 flex items-center gap-4 justify-center">
          <div>
            <div className="mb-2">No address added</div>
            <Link href="/profile/address/add">
              <Button className="cursor-pointer">
                Add Address
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Addresses</h2>
        <div className="hidden sm:block">
          <Link href="/profile/address/new">
            <Button className="cursor-pointer">
              Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {data.map((address, index) => (
          <AddressCard address={address} key={index} />
        ))}
      </div>
    </div>
  );
};


export const AddressCard = ({ address }: { address: TypeAddress }) => {
  return (
    <div
      className="relative border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {address.default && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Default
          </span>
        </div>
      )}

      {/* Header with Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base capitalize">
              {address.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-medium">{address.address_line_1}</p>
          {address.address_line_2 && (
            <p className="text-gray-600">{address.address_line_2}</p>
          )}
          <p className="text-gray-600">
            {address.city}, {address.state} {address.postal_code}
          </p>
          <p className="text-gray-600">{address.country}</p>
        </div>

        {/* Contact Info */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          {address.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{address.phone_number}</span>
            </div>
          )}
          {address.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{address.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <Link href={`/profile/address/${address.id}`}>
          <Button variant="secondary" size="sm" className="p-0 mr-2 text-xs">
            <Pencil className="size-3" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
