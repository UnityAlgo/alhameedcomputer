"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";


const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: (payload: object) => {
      return axios.post(API_URL + "api/user/register", payload)
    }
  })
}


const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const patterns = [
    /^\+92[3-9]\d{9}$/,
    /^92[3-9]\d{9}$/,
    /^0?3[0-9]\d{8}$/
  ];

  return patterns.some(pattern => pattern.test(cleaned));
};

const formsLayout =
  [
    {
      "label": "First Name",
      "type": "text",
      "name": "first_name",
      "placeholder": "First Name",
      "required": true,
      validator: (value: string) => value.length > 0 && value.length <= 30,
      errorMsg: "First name must be between 1 and 30 characters."
    },
    {
      "label": "Last Name",
      "type": "text",
      "name": "last_name",
      "placeholder": "Last Name",
      "required": true,
      validator: (value: string) => value.length > 0 && value.length <= 30,
      errorMsg: "Last name must be between 1 and 30 characters."
    },

    {
      "label": "Username",
      "type": "text",
      "name": "username",
      "placeholder": "Username",
      "required": true,
      validator: (value: string) => value.length >= 3 && value.length <= 30,
      errorMsg: "Username must be between 3 and 30 characters."
    },
    {
      "label": "Email",
      "type": "email",
      "name": "email",
      "placeholder": "Email",
      "required": true,
      validator: (value: string) => /\S+@\S+\.\S+/.test(value),
      errorMsg: "Please enter a valid email address."
    },
    {
      "label": "Phone Number",
      "type": "text",
      "name": "mobile",
      "placeholder": "Phone Number",
      "required": true,
      validator: (value: string) => validatePhoneNumber(value),
      errorMsg: "Please enter a valid phone number (e.g., 03XX-XXXXXXX or +92XXX-XXXXXXX)"
    },
    {
      "label": "Password",
      "type": "password",
      "name": "password",
      "placeholder": "Password",
      "required": true,
      validator: (value: string) => value.length >= 6,
      errorMsg: "Password must be at least 6 characters long."
    }
  ]


function getInitialValues(layout) {
  const state: Record<string, { value: string; error: string }> = {};
  layout.forEach((field) => {
    state[field.name] = {
      "value": "",
      "error": "",
    }
  })

  return state;
}

const Index = () => {
  const router = useRouter();
  const mutation = useRegisterMutation();

  const [values, setValues] = useState(getInitialValues(formsLayout));
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState("");

  const validateAllFields = () => {
    let isValid = true;
    const newValues = { ...values };

    formsLayout.forEach((field) => {
      const fieldValue = values[field.name].value;

      if (field.validator && !field.validator(fieldValue)) {
        newValues[field.name] = {
          value: fieldValue,
          error: field.errorMsg
        };
        isValid = false;
      } else {
        newValues[field.name] = {
          value: fieldValue,
          error: ""
        };
      }
    });

    setValues(newValues);
    return isValid;
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrors(true);

    if (validateAllFields()) {
      // Convert values to the format expected by API
      const payload = Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key].value;
        return acc;
      }, {});

      mutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (mutation.isError) {
      const error = mutation.error?.response?.data;
      if (error?.message) {
        toast.error(error.message);
      }
      else if (typeof error === "object") {
        for (const key of Object.keys(error)) {
          if (error[key]?.[0]) {
            toast.error(error[key]?.[0]);
            setError(error[key]?.[0]);
            break;
          }
        }
      }
      else {
        toast.error("There was an issue while registering the user.");
      }
    }
    if (mutation.isSuccess) {
      toast.success("You've successfully registered. Welcome aboard!");
      router.push("/login");
    }
  }, [mutation.isError, mutation.isSuccess]);


  return (
    <div>
      <Header />
      <div className="max-w-[35rem] mx-auto">
        <div className="py-12">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">Create Your Account</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 px-4">
              {
                formsLayout.map((field, index) => (
                  <div key={index} >
                    <div className="mb-2">
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                        required={field.required}
                        name={field.name}
                        value={values[field.name]?.value}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prev) => ({
                            ...prev,
                            [field.name]: { value, error: prev[field.name].error }
                          }));
                        }}
                      />
                      {showErrors && values[field.name]?.error &&
                        <div className="text-sm text-destructive mt-1">{values[field.name].error}</div>
                      }
                    </div>
                  </div>
                ))
              }
              <div>
                {error && <div className="text-sm text-destructive mt-1">{error}</div>}
              </div>
            </div>
            <div className="px-4">
              <button
                disabled={mutation.isPending}
                type="submit"
                className="bg-primary text-primary-foreground text-center w-full rounded-md py-2 mb-4 flex items-center justify-center gap-2"
              >
                {
                  mutation.isPending ? <Spinner color="light" size="md" /> : <span>Sign Up</span>
                }
              </button>

              <div className="text-center text-sm">
                Already have an Account?{" "}
                <Link href="/login" className="text-blue-700 font-medium">
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;