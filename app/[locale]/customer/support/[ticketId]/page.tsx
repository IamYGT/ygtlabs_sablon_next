"use client";

import { useState, useEffect, useRef, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
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
  XCircle
} from "lucide-react";
import Link from "next/link";
import type { TicketStatus, TicketPriority, MessageType } from "@prisma/client";

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

export default function TicketDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; ticketId: string }> 
}) {
  const resolvedParams = use(params);
  const t = useTranslations("Support");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const locale = resolvedParams.locale;
  const ticketId = resolvedParams.ticketId;
  
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dateLocale = locale === "tr" ? tr : enUS;

  // Ticket detaylarını getir
  const { data: ticket, isLoading } = useQuery<TicketDetails>({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const response = await fetch(`/api/support/tickets/${ticketId}`);
      if (!response.ok) throw new Error("Failed to fetch ticket");
      return response.json();
    },
    refetchInterval: 30000, // 30 saniyede bir güncelle
  });

  // Mesaj gönderme mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const formData = new FormData();
      formData.append("content", content);
      
      // Dosya eklentilerini ekle
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
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
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

  // Otomatik scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  // Dosya seçimi
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setAttachments(Array.from(files));
  };

  // Mesaj gönderme
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
        <Link href={`/${locale}/customer/support`}>
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/customer/support`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
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
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
          </div>
        </div>
        
        {ticket.status !== "closed" && ticket.status !== "resolved" && (
          <Button 
            variant="outline"
            onClick={() => {
              // Ticket'ı kapat
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {t("closeTicket")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
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
                    const isCustomer = message.messageType === "customer_message";
                    const isCurrentUser = message.sender.id === user?.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar>
                          <AvatarImage src={message.sender.profileImage || undefined} />
                          <AvatarFallback>
                            {isCustomer ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{message.sender.name}</span>
                            {message.messageType === "admin_message" && (
                              <Badge variant="secondary" className="text-xs">
                                {t("support")}
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
                            isCurrentUser 
                              ? "bg-primary text-primary-foreground" 
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
              {ticket.status !== "closed" && ticket.status !== "resolved" && (
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder={t("typeMessage")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[60px] resize-none"
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("ticketInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("created")}</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(ticket.createdAt), { 
                    addSuffix: true, 
                    locale: dateLocale 
                  })}
                </p>
              </div>
              
              {ticket.firstResponseAt && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("firstResponse")}</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(ticket.firstResponseAt), { 
                      addSuffix: true, 
                      locale: dateLocale 
                    })}
                  </p>
                </div>
              )}
              
              {ticket.resolvedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("resolved")}</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(ticket.resolvedAt), { 
                      addSuffix: true, 
                      locale: dateLocale 
                    })}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">{t("totalMessages")}</p>
                <p className="font-medium">{ticket.messageCount}</p>
              </div>
              
              {ticket.assignedTo && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("assignedTo")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.assignedTo.profileImage || undefined} />
                      <AvatarFallback>
                        <Shield className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{ticket.assignedTo.name}</p>
                  </div>
                </div>
              )}
              
              {ticket.tags.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("tags")}</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
