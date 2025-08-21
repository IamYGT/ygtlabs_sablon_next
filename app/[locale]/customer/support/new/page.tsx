"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface SupportCategory {
  id: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  icon: string | null;
  color: string | null;
}

export default function NewTicketPage() {
  const t = useTranslations("support");
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const locale = params.locale as string;

  const [attachments, setAttachments] = useState<File[]>([]);

  // Kategorileri getir
  const { data: categories } = useQuery<SupportCategory[]>({
    queryKey: ["support-categories"],
    queryFn: async () => {
      const response = await fetch("/api/support/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Form setup
  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      categoryId: "",
      tags: [],
    },
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      if (data.categoryId) formData.append("categoryId", data.categoryId);
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Dosya eklentilerini ekle
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch("/api/support/tickets", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create ticket");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("ticketCreated"),
        description: t("ticketCreatedDescription"),
      });
      router.push(`/${locale}/customer/support/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Dosya seçimi işlemi
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: ${t("invalidFileType")}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: ${t("fileTooLarge")}`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: t("fileError"),
        description: errors.join("\\n"),
        variant: "destructive",
      });
    }

    setAttachments([...attachments, ...validFiles]);
  };

  // Dosya kaldırma
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Form gönderimi
  const onSubmit = (data: TicketFormData) => {
    createTicketMutation.mutate(data);
  };

  const priorityOptions = [
    { value: "low", label: t("priority.low"), color: "bg-gray-500" },
    { value: "medium", label: t("priority.medium"), color: "bg-blue-500" },
    { value: "high", label: t("priority.high"), color: "bg-orange-500" },
    { value: "urgent", label: t("priority.urgent"), color: "bg-red-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/customer/support`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("newTicketTitle")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("newTicketDescription")}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("ticketDetails")}</CardTitle>
          <CardDescription>{t("ticketDetailsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ticketTitle")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("ticketTitlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("ticketTitleDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                {category.color && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                )}
                                {category.name[locale] || category.name.en}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("priority.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectPriority")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${option.color}`}
                                />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("priorityDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("descriptionPlaceholder")}
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("descriptionHelp")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <div className="space-y-4">
                <div>
                  <FormLabel>{t("attachments")}</FormLabel>
                  <FormDescription>
                    {t("attachmentsDescription")}
                  </FormDescription>
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    multiple
                    accept={ACCEPTED_FILE_TYPES.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Paperclip className="h-4 w-4 mr-2" />
                        {t("addAttachment")}
                      </span>
                    </Button>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024).toFixed(2)} KB
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Link href={`/${locale}/customer/support`}>
                  <Button type="button" variant="outline">
                    {t("cancel")}
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createTicketMutation.isPending}
                  className="gap-2"
                >
                  {createTicketMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("creating")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("createTicket")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Help Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("ticketHelpText")}</AlertDescription>
      </Alert>
    </div>
  );
}
