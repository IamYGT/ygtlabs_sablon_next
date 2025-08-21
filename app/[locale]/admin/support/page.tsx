"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  User,
  Calendar,
  TrendingUp,
  UserCheck,
  Trash2,
  Eye,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import type { TicketStatus, TicketPriority } from "@prisma/client";

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
  firstResponseAt: string | null;
  resolvedAt: string | null;
  messageCount: number;
  category: {
    id: string;
    name: Record<string, string>;
    color: string;
  } | null;
  customer: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  _count: {
    messages: number;
    attachments: number;
  };
}

interface TicketStats {
  total: number;
  open: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  todayNew: number;
  todayResolved: number;
}

const statusConfig = {
  open: { label: "open", icon: AlertCircle, color: "bg-yellow-500" },
  pending: { label: "pending", icon: Clock, color: "bg-blue-500" },
  in_progress: { label: "inProgress", icon: MessageSquare, color: "bg-purple-500" },
  resolved: { label: "resolved", icon: CheckCircle, color: "bg-green-500" },
  closed: { label: "closed", icon: XCircle, color: "bg-gray-500" },
};

const priorityConfig = {
  low: { label: "low", color: "bg-gray-500" },
  medium: { label: "medium", color: "bg-blue-500" },
  high: { label: "high", color: "bg-orange-500" },
  urgent: { label: "urgent", color: "bg-red-500" },
};

export default function AdminSupportPage() {
  const t = useTranslations("AdminSupport");
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const locale = params.locale as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  // İstatistikleri getir
  const { data: stats } = useQuery<TicketStats>({
    queryKey: ["admin-support-stats"],
    queryFn: async () => {
      const response = await fetch("/api/support/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    refetchInterval: 60000, // Her dakika güncelle
  });

  // Admin listesini getir (atama için)
  const { data: admins } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?role=admin");
      if (!response.ok) throw new Error("Failed to fetch admins");
      return response.json();
    },
  });

  // Ticketları getir
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["admin-tickets", statusFilter, priorityFilter, assigneeFilter, searchQuery],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "all") queryParams.append("status", statusFilter);
      if (priorityFilter !== "all") queryParams.append("priority", priorityFilter);
      if (assigneeFilter !== "all") queryParams.append("assignedToId", assigneeFilter);
      if (searchQuery) queryParams.append("search", searchQuery);
      
      const response = await fetch(`/api/support/tickets?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
  });

  const tickets = ticketsData?.tickets || [];

  // Ticket durumunu güncelle
  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: TicketStatus }) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-stats"] });
      toast({
        title: t("statusUpdated"),
        variant: "success",
      });
    },
  });

  // Ticket'ı ata
  const assignTicketMutation = useMutation({
    mutationFn: async ({ ticketId, assignedToId }: { ticketId: string; assignedToId: string | null }) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId }),
      });
      if (!response.ok) throw new Error("Failed to assign ticket");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast({
        title: t("ticketAssigned"),
        variant: "success",
      });
    },
  });

  // Ticket'ı sil
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete ticket");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-stats"] });
      toast({
        title: t("ticketDeleted"),
        variant: "success",
      });
    },
  });

  const dateLocale = locale === "tr" ? tr : enUS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalTickets")}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {stats?.todayNew || 0} {t("newToday")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("openTickets")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.open || 0}</div>
            <Badge variant="secondary" className="text-xs">
              {t("needsAttention")}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("inProgress")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
            <p className="text-xs text-muted-foreground">{t("beingHandled")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("resolved")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {stats?.todayResolved || 0} {t("todayResolved")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("avgResponseTime")}</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avgResponseTime ? `${Math.round(stats.avgResponseTime / 60)}m` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">{t("firstResponse")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
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
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                {Object.keys(statusConfig).map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`status.${statusConfig[status as keyof typeof statusConfig].label}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder={t("filterByPriority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPriorities")}</SelectItem>
                {Object.keys(priorityConfig).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(`priority.${priorityConfig[priority as keyof typeof priorityConfig].label}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder={t("filterByAssignee")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAssignees")}</SelectItem>
                <SelectItem value="unassigned">{t("unassigned")}</SelectItem>
                {admins?.users?.map((admin: { id: string; name: string }) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {admin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Listesi */}
      <div className="space-y-4">
        {isLoading ? (
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
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noTickets")}</h3>
              <p className="text-muted-foreground">{t("noTicketsDescription")}</p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket: SupportTicket) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            return (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {ticket.ticketNumber}
                        </Badge>
                        <Badge className={`${statusConfig[ticket.status].color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {t(`status.${statusConfig[ticket.status].label}`)}
                        </Badge>
                        <Badge className={`${priorityConfig[ticket.priority].color} text-white`}>
                          {t(`priority.${priorityConfig[ticket.priority].label}`)}
                        </Badge>
                        {ticket.category && (
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: ticket.category.color }}
                          >
                            {ticket.category.name[locale] || ticket.category.name.en}
                          </Badge>
                        )}
                      </div>
                      <CardTitle 
                        className="text-xl cursor-pointer hover:text-primary"
                        onClick={() => router.push(`/${locale}/admin/support/${ticket.id}`)}
                      >
                        {ticket.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {ticket.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/${locale}/admin/support/${ticket.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t("view")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => updateStatusMutation.mutate({ 
                            ticketId: ticket.id, 
                            status: "in_progress" 
                          })}
                          disabled={ticket.status === "in_progress"}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t("markInProgress")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatusMutation.mutate({ 
                            ticketId: ticket.id, 
                            status: "resolved" 
                          })}
                          disabled={ticket.status === "resolved" || ticket.status === "closed"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t("markResolved")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm(t("deleteConfirm"))) {
                              deleteTicketMutation.mutate(ticket.id);
                            }
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{ticket.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(ticket.createdAt), { 
                            addSuffix: true, 
                            locale: dateLocale 
                          })}
                        </span>
                      </div>
                      {ticket._count.messages > 0 && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket._count.messages}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.assignedTo.profileImage || undefined} />
                            <AvatarFallback>
                              <UserCheck className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{ticket.assignedTo.name}</span>
                        </div>
                      ) : (
                        <Select
                          value=""
                          onValueChange={(value) => 
                            assignTicketMutation.mutate({ 
                              ticketId: ticket.id, 
                              assignedToId: value 
                            })
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue placeholder={t("assign")} />
                          </SelectTrigger>
                          <SelectContent>
                            {admins?.users?.map((admin: { id: string; name: string }) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
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
