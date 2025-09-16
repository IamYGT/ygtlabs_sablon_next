"use client";

import { AdminPageGuard } from "@/components/panel/AdminPageGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlagWrapper } from "@/components/ui/flag-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, Info, Languages, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateAboutDialog } from "./CreateAboutDialog";
import { DeleteAboutDialog } from "./DeleteAboutDialog";
import { EditAboutDialog } from "./EditAboutDialog";
import { ViewAboutDialog } from "./ViewAboutDialog";

// Tipleri tanımla
interface About {
  id: string;
  about: string;
  mission: string;
  vision: string;
  roadmap: string;
  createdAt: string;
  updatedAt: string;
}

interface AboutPageClientProps {
  messages: {
    title: string;
    description: string;
    newAbout: string;
    contentTitle: string;
    field: string;
    content: string;
    about: string;
    mission: string;
    vision: string;
    roadmap: string;
    noContent: string;
    noContentDescription: string;
    createFirstAbout: string;
    loading: string;
    actions: {
      edit: string;
      delete: string;
      view: string;
    };
    fetchError: string;
  };
}

function parseJSONField(
  value: string | unknown,
  locale: string = "tr"
): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed?.[locale] || value;
    } catch {
      return value;
    }
  }
  return String(value || "");
}

export function AboutPageClient({ messages }: AboutPageClientProps) {
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [locale, setLocale] = useState<"tr" | "en">("tr");

  const fetchAboutData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/about");

      if (!response.ok) {
        throw new Error(messages.fetchError);
      }

      const data = await response.json();
      setAboutData(data.about);
    } catch (error) {
      console.error("About data fetch error:", error);
      toast.error(messages.fetchError);
    } finally {
      setLoading(false);
    }
  }, [messages.fetchError]);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  if (loading) {
    return <div>{messages.loading}</div>;
  }

  return (
    <AdminPageGuard requiredPermission="admin.about.view">
      <div className="space-y-9">
        {/* Header */}
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {messages.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {messages.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={locale}
              onValueChange={(value: "tr" | "en") => setLocale(value)}
            >
              <SelectTrigger className="w-36">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">
                  <div className="flex items-center gap-2">
                    <FlagWrapper locale="tr" />
                    Türkçe
                  </div>
                </SelectItem>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <FlagWrapper locale="en" />
                    English
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {!aboutData && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                {messages.newAbout}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {aboutData ? (
          <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {messages.contentTitle}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewDialogOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {messages.actions.view}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {messages.actions.edit}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {messages.actions.delete}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{messages.about}</h3>
                <p className="text-muted-foreground line-clamp-4">
                  {parseJSONField(aboutData.about, locale)}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{messages.mission}</h3>
                <p className="text-muted-foreground line-clamp-4">
                  {parseJSONField(aboutData.mission, locale)}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{messages.vision}</h3>
                <p className="text-muted-foreground line-clamp-4">
                  {parseJSONField(aboutData.vision, locale)}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{messages.roadmap}</h3>
                <p className="text-muted-foreground line-clamp-4">
                  {parseJSONField(aboutData.roadmap, locale)}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Info className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {messages.noContent}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {messages.noContentDescription}
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              <Plus className="h-5 w-5 mr-2" />
              {messages.createFirstAbout}
            </Button>
          </div>
        )}
      </div>
      <CreateAboutDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchAboutData}
      />
      <EditAboutDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchAboutData}
        aboutData={aboutData}
      />
      <DeleteAboutDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchAboutData}
        aboutData={aboutData}
      />
      <ViewAboutDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        aboutData={aboutData}
        locale={locale}
      />
    </AdminPageGuard>
  );
}
