"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  PlayCircle
} from "lucide-react";

export type TicketStatus = "open" | "pending" | "in_progress" | "resolved" | "closed";

interface TicketStatusBadgeProps {
  status: TicketStatus;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<TicketStatus, {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}> = {
  open: {
    label: "Open",
    variant: "default",
    icon: AlertCircle,
    className: "bg-blue-500 hover:bg-blue-600"
  },
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
    className: "bg-yellow-500 hover:bg-yellow-600"
  },
  in_progress: {
    label: "In Progress",
    variant: "default",
    icon: PlayCircle,
    className: "bg-purple-500 hover:bg-purple-600"
  },
  resolved: {
    label: "Resolved",
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-500 hover:bg-green-600"
  },
  closed: {
    label: "Closed",
    variant: "secondary",
    icon: XCircle,
    className: "bg-gray-500 hover:bg-gray-600"
  }
};

export function TicketStatusBadge({ 
  status, 
  showIcon = true,
  className 
}: TicketStatusBadgeProps) {
  const config = statusConfig[status];
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
