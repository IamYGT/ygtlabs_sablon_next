"use client";

import { useState, useEffect, useRef, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Paperclip,
  ArrowLeft,
  Clock,
  User,
  Shield,
  FileText,
  Download,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  XCircle,
  UserCheck,
  Trash2,
  History
} from "lucide-react";
import Link from "next/link";
import type { TicketStatus, TicketPriority, MessageType } from "@prisma/client";

// Interfaces same as customer version
interface TicketDetails {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  firstResponseAt: string | null;
  lastMessageAt: string | null;
  messageCount: number;
  attachmentCount: number;
  tags: string[];
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
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  assignments: TicketAssignment[];
}

interface TicketMessage {
  id: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  attachments: TicketAttachment[];
}

interface TicketAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string | null;
  createdAt: string;
}

interface TicketAssignment {
  id: string;
  createdAt: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedBy: {
    id: string;
    name: string;
    email: string;
  };
  reason: string | null;
  note: string | null;
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

export default function AdminTicketDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; ticketId: string }> 
}) {
  const resolvedParams = use(params);
  const t = useTranslations("AdminSupport");
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const locale = resolvedParams.locale;
  const ticketId = resolvedParams.ticketId;
  
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dateLocale = locale === "tr" ? tr : enUS;

  // Admin listesi
  const { data: admins } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?role=admin");
      if (!response.ok) throw new Error("Failed to fetch admins");
      return response.json();
    },
  });

  // Ticket detayları
  const { data: ticket, isLoading } = useQuery<TicketDetails>({
    queryKey: ["admin-ticket", ticketId],
    queryFn: async () => {
      const response = await fetch(`/api/support/tickets/${ticketId}`);
      if (!response.ok) throw new Error("Failed to fetch ticket");
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Durum güncelle
  const updateStatusMutation = useMutation({
    mutationFn: async (status: TicketStatus) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
      toast({
        title: t("statusUpdated"),
        variant: "success",
      });
    },
  });

  // Öncelik güncelle
  const updatePriorityMutation = useMutation({
    mutationFn: async (priority: TicketPriority) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      if (!response.ok) throw new Error("Failed to update priority");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
      toast({
        title: t("priorityUpdated"),
        variant: "success",
      });
    },
  });

  // Ticket ata
  const assignTicketMutation = useMutation({
    mutationFn: async (assignedToId: string | null) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId }),
      });
      if (!response.ok) throw new Error("Failed to assign ticket");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
      toast({
        title: t("ticketAssigned"),
        variant: "success",
      });
    },
  });

  // Mesaj gönder
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("messageType", isInternalNote ? "system_message" : "admin_message");
      
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      setAttachments([]);
      setIsInternalNote(false);
      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setAttachments(Array.from(files));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    sendMessageMutation.mutate(newMessage);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{t("ticketNotFound")}</h2>
        <Link href={`/${locale}/admin/support`}>
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToTickets")}
          </Button>
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[ticket.status].icon;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/admin/support`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono">
                {ticket.ticketNumber}
              </Badge>
              <Select 
                value={ticket.status} 
                onValueChange={(value) => updateStatusMutation.mutate(value as TicketStatus)}
              >
                <SelectTrigger className="w-[140px] h-7">
                  <div className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-3 w-3" />
                          {t(`status.${config.label}`)}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Select 
                value={ticket.priority} 
                onValueChange={(value) => updatePriorityMutation.mutate(value as TicketPriority)}
              >
                <SelectTrigger className="w-[120px] h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                        {t(`priority.${config.label}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {ticket.category && (
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: ticket.category.color }}
                >
                  {ticket.category.name[locale] || ticket.category.name.en}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={ticket.assignedTo?.id || ""}
            onValueChange={(value) => assignTicketMutation.mutate(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("assignTo")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t("unassigned")}
              </SelectItem>
              {admins?.users?.map((admin: { id: string; name: string }) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (confirm(t("deleteConfirm"))) {
                fetch(`/api/support/tickets/${ticketId}`, { method: "DELETE" })
                  .then(() => {
                    toast({ title: t("ticketDeleted"), variant: "success" });
                    router.push(`/${locale}/admin/support`);
                  });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Messages */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <CardTitle>{t("conversation")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {/* Initial Message */}
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={ticket.customer.profileImage || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{ticket.customer.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {ticket.customer.email}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.createdAt), { 
                            addSuffix: true, 
                            locale: dateLocale 
                          })}
                        </span>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="whitespace-pre-wrap">{ticket.description}</p>
                      </div>
                      {ticket.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {ticket.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.fileUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <FileText className="h-4 w-4" />
                              {attachment.fileName}
                              <Download className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  {ticket.messages.map((message) => {
                    const isSystemMessage = message.messageType === "system_message";
                    const isAdminMessage = message.messageType === "admin_message";
                    const _isCurrentUser = message.sender.id === user?.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex gap-3 ${isSystemMessage ? "opacity-75 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg" : ""}`}
                      >
                        <Avatar>
                          <AvatarImage src={message.sender.profileImage || undefined} />
                          <AvatarFallback>
                            {isAdminMessage || isSystemMessage ? (
                              <Shield className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{message.sender.name}</span>
                            {isAdminMessage && (
                              <Badge variant="secondary" className="text-xs">
                                {t("support")}
                              </Badge>
                            )}
                            {isSystemMessage && (
                              <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900">
                                {t("internalNote")}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), { 
                                addSuffix: true, 
                                locale: dateLocale 
                              })}
                            </span>
                            {message.isEdited && (
                              <span className="text-xs text-muted-foreground">
                                ({t("edited")})
                              </span>
                            )}
                          </div>
                          <div className={`inline-block rounded-lg p-3 ${
                            isSystemMessage 
                              ? "bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700"
                              : "bg-muted"
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.fileUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <FileText className="h-4 w-4" />
                                  {attachment.fileName}
                                  <Download className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    {t("internalNote")}
                  </label>
                  {isInternalNote && (
                    <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900">
                      {t("onlyVisibleToAdmins")}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder={isInternalNote ? t("typeInternalNote") : t("typeMessage")}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className={`min-h-[60px] resize-none ${
                        isInternalNote ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button size="icon" variant="outline" asChild>
                        <span>
                          <Paperclip className="h-4 w-4" />
                        </span>
                      </Button>
                    </label>
                    <Button 
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={sendMessageMutation.isPending || (!newMessage.trim() && attachments.length === 0)}
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {file.name}
                        <button
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("customerInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={ticket.customer.profileImage || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ticket.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{ticket.customer.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("ticketInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t("created")}</p>
                <p className="text-sm font-medium">
                  {format(new Date(ticket.createdAt), "PPP", { locale: dateLocale })}
                </p>
              </div>
              
              {ticket.firstResponseAt && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("firstResponse")}</p>
                  <p className="text-sm font-medium">
                    {formatDistanceToNow(new Date(ticket.firstResponseAt), { 
                      addSuffix: true, 
                      locale: dateLocale 
                    })}
                  </p>
                </div>
              )}
              
              {ticket.resolvedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("resolved")}</p>
                  <p className="text-sm font-medium">
                    {format(new Date(ticket.resolvedAt), "PPP", { locale: dateLocale })}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-muted-foreground">{t("totalMessages")}</p>
                <p className="text-sm font-medium">{ticket.messageCount}</p>
              </div>
              
              {ticket.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("tags")}</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment History */}
          {ticket.assignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4" />
                  {t("assignmentHistory")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ticket.assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {assignment.assignedTo ? (
                          <span className="font-medium">{assignment.assignedTo.name}</span>
                        ) : (
                          <span className="text-muted-foreground">{t("unassigned")}</span>
                        )}
                      </div>
                      <div className="text-muted-foreground pl-4">
                        {t("by")} {assignment.assignedBy.name}
                      </div>
                      <div className="text-muted-foreground pl-4">
                        {formatDistanceToNow(new Date(assignment.createdAt), { 
                          addSuffix: true, 
                          locale: dateLocale 
                        })}
                      </div>
                      {assignment.note && (
                        <div className="pl-4 italic">{assignment.note}</div>
                      )}
                      <Separator className="my-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
