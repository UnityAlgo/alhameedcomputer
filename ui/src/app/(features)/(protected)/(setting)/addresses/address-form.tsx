"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { useCreateAddress, useUpdateAddress } from "@/api/address";

const defaultValues = {
    title: "",
    address_type: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone_number: "",
    email: "",
    default: false,
};



const AddAddressForm = ({ open, setOpen, editingAddress, setEditingAddress }: any) => {
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const [formValues, setFormValues] = useState(defaultValues);

    useEffect(() => {
        if (editingAddress) {
            setFormValues(editingAddress);
        } else {
            setFormValues(defaultValues);
        }
    }, [editingAddress]);

    const resetForm = () => {
        setFormValues(defaultValues);
        setEditingAddress(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormValues({
            ...formValues,
            [name]:
                type === "checkbox" && e.target instanceof HTMLInputElement
                    ? e.target.checked
                    : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            updateAddress.mutate(
                { ...formValues, id: editingAddress.id },
                {
                    onSuccess: () => {
                        resetForm();
                        setOpen(false);
                    },
                }
            );
        } else {
            createAddress.mutate(formValues, {
                onSuccess: () => {
                    resetForm();
                    setOpen(false);
                },
            });
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    onClick={() => {
                        resetForm();
                        setOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    <Plus className="h-4 w-4" /> Add Address
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] bg-white p-5 rounded-xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            name="title"
                            value={formValues.title || ""}
                            onChange={handleChange}
                            type="text"
                            placeholder="Home Address"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Address Type
                        </label>
                        <select
                            name="address_type"
                            value={formValues.address_type || ""}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Address Line 1
                        </label>
                        <input
                            name="address_line_1"
                            value={formValues.address_line_1 || ""}
                            onChange={handleChange}
                            type="text"
                            placeholder="1234 Oak Street"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Address Line 2
                        </label>
                        <input
                            name="address_line_2"
                            value={formValues.address_line_2 || ""}
                            onChange={handleChange}
                            type="text"
                            placeholder="Apartment, suite, etc."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                City
                            </label>
                            <input
                                name="city"
                                value={formValues.city || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                State
                            </label>
                            <input
                                name="state"
                                value={formValues.state || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                Postal Code
                            </label>
                            <input
                                name="postal_code"
                                value={formValues.postal_code || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                Country
                            </label>
                            <input
                                name="country"
                                value={formValues.country || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                Phone
                            </label>
                            <input
                                name="phone_number"
                                value={formValues.phone_number || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                value={formValues.email || ""}
                                onChange={handleChange}
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="default"
                            checked={formValues.default}
                            onChange={handleChange}
                        />
                        <span className="text-sm text-gray-700">Set as default</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                        {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default AddAddressForm;



