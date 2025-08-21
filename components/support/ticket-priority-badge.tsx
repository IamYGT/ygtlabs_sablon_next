"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<TicketPriority, {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}> = {
  low: {
    label: "Low",
    variant: "secondary",
    icon: ArrowDown,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-200"
  },
  medium: {
    label: "Medium",
    variant: "outline",
    icon: Minus,
    className: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
  },
  high: {
    label: "High",
    variant: "default",
    icon: ArrowUp,
    className: "bg-orange-500 hover:bg-orange-600"
  },
  urgent: {
    label: "Urgent",
    variant: "destructive",
    icon: AlertTriangle,
    className: "bg-red-500 hover:bg-red-600"
  }
};

export function TicketPriorityBadge({ 
  priority, 
  showIcon = true,
  className 
}: TicketPriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "inline-flex items-center gap-1",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
    </Badge>
  );
}
