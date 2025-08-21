"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { TicketPriority, TicketStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  messageCount: number;
  category: {
    name: Record<string, string>;
    color: string;
  } | null;
  assignedTo: {
    name: string;
    profileImage: string | null;
  } | null;
  _count: {
    messages: number;
  };
}

const statusConfig = {
  open: { label: "open", icon: AlertCircle, color: "bg-yellow-500" },
  pending: { label: "pending", icon: Clock, color: "bg-blue-500" },
  in_progress: {
    label: "inProgress",
    icon: MessageSquare,
    color: "bg-purple-500",
  },
  resolved: { label: "resolved", icon: CheckCircle, color: "bg-green-500" },
  closed: { label: "closed", icon: XCircle, color: "bg-gray-500" },
};

const priorityConfig = {
  low: { label: "low", color: "bg-gray-500" },
  medium: { label: "medium", color: "bg-blue-500" },
  high: { label: "high", color: "bg-orange-500" },
  urgent: { label: "urgent", color: "bg-red-500" },
};

export default function CustomerSupportPage() {
  const t = useTranslations("support");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data, isLoading } = useQuery<{
    tickets: SupportTicket[];
    pagination: any;
  }>({
    queryKey: ["customer-tickets", statusFilter, priorityFilter],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "all") queryParams.append("status", statusFilter);
      if (priorityFilter !== "all")
        queryParams.append("priority", priorityFilter);

      const response = await fetch(`/api/support/tickets?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
  });

  const tickets = data?.tickets;

  // Filtreleme
  const filteredTickets =
    tickets?.filter((ticket) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(query) ||
          ticket.ticketNumber.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query)
        );
      }
      return true;
    }) || [];

  const dateLocale = locale === "tr" ? tr : enUS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        <Link href={`/${locale}/customer/support/new`}>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            {t("newTicket")}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("filters.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                {Object.keys(statusConfig).map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(
                      `status.${
                        statusConfig[status as keyof typeof statusConfig].label
                      }`
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("filterByPriority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPriorities")}</SelectItem>
                {Object.keys(priorityConfig).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(
                      `priority.${
                        priorityConfig[priority as keyof typeof priorityConfig]
                          .label
                      }`
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : filteredTickets.length === 0 ? (
          // Empty state
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noTickets")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("noTicketsDescription")}
              </p>
              <Link href={`/${locale}/customer/support/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("createFirstTicket")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // Tickets
          filteredTickets.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            return (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/${locale}/customer/support/${ticket.id}`)
                }
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {ticket.ticketNumber}
                        </Badge>
                        <Badge
                          className={`${
                            statusConfig[ticket.status].color
                          } text-white`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {t(`status.${statusConfig[ticket.status].label}`)}
                        </Badge>
                        <Badge
                          className={`${
                            priorityConfig[ticket.priority].color
                          } text-white`}
                        >
                          {t(
                            `priority.${priorityConfig[ticket.priority].label}`
                          )}
                        </Badge>
                        {ticket.category && (
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: ticket.category.color }}
                          >
                            {ticket.category.name[locale] ||
                              ticket.category.name.en}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{ticket.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {ticket.description}
                      </CardDescription>
                    </div>
                    {ticket._count.messages > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">
                          {ticket._count.messages}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {t("created")}{" "}
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </span>
                    {ticket.lastMessageAt && (
                      <span>
                        {t("lastMessage")}{" "}
                        {formatDistanceToNow(new Date(ticket.lastMessageAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </span>
                    )}
                    {ticket.assignedTo && (
                      <span className="flex items-center gap-1">
                        {t("assignedTo")}: {ticket.assignedTo.name}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
