"use client";

import { use } from "react";
import { useAddressQuery, useAddressMutation, TypeAddress } from "@/api/address";
import { AddressForm } from "../form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const router = useRouter();
    const { id } = use(params);
    const isNew = id === "new";
    const { data: address, isLoading } = useAddressQuery({ enabled: !isNew, id });
    const mutation = useAddressMutation();


    const handleSubmit = (values: TypeAddress) => {
        const payload = isNew ? values : { ...values, id: address?.id };
        mutation.mutate(payload, {
            onSuccess: () => {
                toast.success(`Address ${isNew ? "added" : "updated"} successfully`);
                router.push("/profile/address");
            }
        });
    }

    return (
        <div className="p-4">
            <header className="mb-6">
                <div className="border-b border-input font-bold">
                    {id === "new" ? "Add new Address" : "Edit Address"}
                </div>
            </header>
            <div>
                {isNew ? (
                    <AddressForm
                        onSubmit={handleSubmit}
                        isLoading={mutation.isPending}
                    />
                ) : address ? (
                    <AddressForm
                        onSubmit={handleSubmit}
                        initialData={address}
                        isLoading={isLoading}
                    />
                ) : <></>}
            </div>
        </div>
    );
}

export default Page;