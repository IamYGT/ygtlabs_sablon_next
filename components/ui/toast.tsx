"use client";

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

type ToastProps = React.ComponentProps<typeof SonnerToaster>;

function toast({
    title,
    description,
    variant = "default",
    ...props
}: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
} & Omit<React.ComponentProps<typeof sonnerToast>, "position">) {
    return sonnerToast[variant === "destructive" ? "error" : "message"](
        title,
        {
            description,
            ...props,
        }
    );
}

export { toast, SonnerToaster as Toaster };
export type { ToastProps }; 