"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Eye, EyeClosed } from "lucide-react";

export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => {
        const [show, setShow] = React.useState(false);

        return (
            <div className="relative">
                <input
                    {...props}
                    ref={ref}
                    type={show ? "text" : "password"}
                    className={cn(
                        "placeholder:text-muted-foreground text-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 pr-10", // Added pr-10 to prevent text overlapping icon
                        className
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? (
                        <EyeClosed className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";