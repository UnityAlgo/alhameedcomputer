"use client"
import { axiosClient } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { validatePhoneNumber } from "@/utils";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type TypeUser = {
    id: string
    full_name: string
    first_name: string
    last_name: string
    username: string
    email: string
    image: string
    mobile: string
    dob: string
}

export const useUserQuery = (): UseQueryResult<TypeUser> => {
    return useQuery({
        queryKey: ["get-user"],
        queryFn: async () => {
            const response = await axiosClient.get("api/user")
            return response.data;
        }
    })
}

const useUserUpdateMutation = () => {
    return useMutation({
        mutationFn: async (data: FormData) => {
            return axiosClient.put("api/user", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        retry: 3,
    })
}


const ImageInputAvator = ({ defaultValue, onChange }: { defaultValue?: string, onChange?: (file: File | null) => void }) => {
    const [image, setImage] = useState<File | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        onChange?.(file || null);

        if (!file) return;
        setImage(file);
    }

    return (
        <div className="h-20 w-20 rounded-full relative overflow-hidden shadow-md">
            <img src={image ? URL.createObjectURL(image) : defaultValue || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" />
            <input type="file" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
    )
}

const Page = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        image: '' as unknown as File | string,
        mobile: '',
        dob: '',
    })
    const router = useRouter();
    const userAPI = useUserQuery();
    const mutation = useUserUpdateMutation();
    const [error, setError] = useState("");

    useEffect(() => {
        if (userAPI.isSuccess) {
            const { data } = userAPI;
            setFormData({
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                mobile: data.mobile,
                image: data.image,
                dob: data.dob,
            });
        }
    }, [userAPI.data, userAPI.isSuccess])

    useEffect(() => {
        if (mutation.isSuccess) {
            setError("");
            setTimeout(() => {
                router.push("/profile");
            }, 500);
        }

        if (mutation.isError) {
            setError("An error occurred while updating the profile. Please try again later.");
        }
    }, [mutation.isSuccess, mutation.isError, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhoneNumber(formData.mobile)) {
            setError("Please enter a valid mobile number.");
            return
        }
        if (moment(formData.dob).isAfter(moment())) {
            setError("Date of birth cannot be in the future.");
            return;
        }

        const payload = new FormData();
        for (const key in formData) {
            const value = (formData as any)[key];
            if (key === 'image' && value instanceof File) {
                payload.append(key, value);
            } else if (key !== 'image') {
                payload.append(key, value);
            }
        }


        mutation.mutate(payload);
    }

    return (
        <main className="min-h-screen py-6">
            <div className="mb-6">
                <h1 className="font-bold">
                    Update Your Profile
                </h1>
                <p className="text-sm">Keep your information up to date</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center md:justify-start mb-6">
                    <ImageInputAvator defaultValue={typeof formData.image === 'string' ? formData.image : undefined}

                        onChange={(file) => {
                            setFormData(prev => ({ ...prev, image: file }))
                        }} />
                </div>

                <div className="mb-2">
                    <Label htmlFor="first_name" className="font-medium text-sm">
                        First Name
                    </Label>
                    <Input id="first_name" value={formData.first_name} required name="first_name"
                        onChange={(event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))}
                    />
                </div>

                <div className="mb-2">
                    <Label htmlFor="last_name" className="font-medium text-sm" >
                        Last Name
                    </Label>
                    <Input id="last_name" value={formData.last_name} required name="last_name"
                        onChange={(event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))} />
                </div>

                <div className="mb-2">
                    <Label htmlFor="username" className="font-medium text-sm" >
                        Username
                    </Label>
                    <Input id="username" value={formData.username} required name="username"
                        onChange={(event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))} />
                </div>

                <div className="mb-2">
                    <Label htmlFor="mobile" className="font-medium text-sm">
                        Mobile No.
                    </Label>
                    <Input id="mobile" value={formData.mobile} required name="mobile"
                        onChange={(event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))} />
                </div>

                <div className="mb-2">
                    <Label htmlFor="dob" className="font-medium text-sm">
                        Date of Birth
                    </Label>
                    <Input id="dob" type="date" value={formData.dob} required name="dob"
                        onChange={(event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))} />
                </div>

                <div className="mt-4">
                    {error && <p className="text-destructive text-sm mb-2">{error}</p>}
                    <Button type="submit" size="sm" className="w-full md:w-auto" disabled={mutation.isPending}>
                        Update Profile
                        {mutation.isPending && <Spinner />}
                    </Button>
                </div>
            </form>
        </main>
    )
}

export default Page;