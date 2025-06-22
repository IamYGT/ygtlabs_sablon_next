"use client"

import { Toaster } from "@/components/ui/toast";

export function Sonner() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        className: "rounded-md border bg-background text-foreground p-4 shadow-lg",
      }}
    />
  );
} 