"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Eye, EyeClosed } from "lucide-react";

export const PasswordInput = ({ className, ...props }: React.ComponentProps<"input">) => {

    const [show, setShow] = React.useState(false);
    return (
        <div className="relative">
            <input
                data-slot="input"
                type={show ? "text" : "password"}
                className={cn(
                    "placeholder:text-muted-foreground text-black  border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20",
                    className
                )}
            // {...props}
            />


            <div className="absolute right-3 top-1/2 translate-y-[-50%] cursor-pointer" onClick={() => setShow(!show)}>
                {show ?
                    <EyeClosed className="size-4" /> :
                    <Eye className="size-4" />
                }

            </div>
        </div>
    )
}