"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { validatePassword } from "@/utils";
import React, { useState } from "react";

const Index = () => {

  const [values, setValues] = useState({
    current_password: "",
    new_password: ""
  });

  const [errors, setErrors] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(values.new_password)) {
      setErrors("Password must be 8-64 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
  }

  return (
    <main className="min-h-screen py-6">
      <div className="mb-6">
        <h1 className="font-bold">
          Change Password
        </h1>
        <p className="text-sm">Keep your information up to date</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-4 max-w-96">
            <label htmlFor="current_password" className="font-medium text-sm" >
              Current Password
            </label>
            <PasswordInput name="current_password" type="password" required onChange={(e) => setValues((prev) => ({ ...prev, current_password: e.target.value }))} />
          </div>

          <div className="max-w-96">
            <label htmlFor="new_password" className="font-medium text-sm" >
              New Password
            </label>
            <PasswordInput name="new_password" type="password" required onChange={(e) => {
              setValues((prev) => ({ ...prev, new_password: e.target.value }));
              if (!validatePassword(e.target.value)) {
                setErrors("Password must be 8-64 characters long and include uppercase, lowercase, number, and special character.");
              } else {
                setErrors("");
              }
            }} />
          </div>
          {errors && <p className="text-sm text-red-500 mt-2">{errors}</p>}
        </div>

        <Button type="submit">
          Update Password
        </Button>
      </form>
    </main>
  )

};

export default Index;