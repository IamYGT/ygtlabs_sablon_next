"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000 }: ToastProps) => {
      const message = title || description || "";
      
      switch (variant) {
        case "destructive":
          sonnerToast.error(message, {
            description: title ? description : undefined,
            duration,
          });
          break;
        case "success":
          sonnerToast.success(message, {
            description: title ? description : undefined,
            duration,
          });
          break;
        default:
          sonnerToast(message, {
            description: title ? description : undefined,
            duration,
          });
      }
    },
    []
  );

  return { toast };
}
