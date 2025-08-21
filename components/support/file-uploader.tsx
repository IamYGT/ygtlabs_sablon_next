"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { File, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  ticketId: string;
  messageId?: string;
  onUploadComplete?: (attachment: {
    id: string;
    fileName: string;
    fileSize: number;
    url: string;
  }) => void;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
}

interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  url: string;
  progress?: number;
  uploading?: boolean;
  error?: string;
}

const ALLOWED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
};

export function FileUploader({
  ticketId,
  messageId,
  onUploadComplete,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = useCallback(
    async (file: File) => {
      const tempId = Math.random().toString(36).substring(7);
      const newFile: UploadedFile = {
        id: tempId,
        fileName: file.name,
        fileSize: file.size,
        url: "",
        uploading: true,
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ticketId", ticketId);
        if (messageId) {
          formData.append("messageId", messageId);
        }

        const response = await fetch("/api/support/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();

        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? {
                  ...f,
                  id: data.attachment.id,
                  url: data.attachment.url,
                  uploading: false,
                  progress: 100,
                }
              : f
          )
        );

        if (onUploadComplete) {
          onUploadComplete(data.attachment);
        }

        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempId ? { ...f, uploading: false, error: errorMessage } : f
          )
        );

        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [ticketId, messageId, onUploadComplete, toast]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${maxFiles} files.`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      for (const file of acceptedFiles) {
        await uploadFile(file);
      }

      setUploading(false);
    },
    [files, maxFiles, toast, uploadFile]
  );

  const dropzoneState = useDropzone({
    onDrop,
    accept: ALLOWED_TYPES,
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles,
  });

  const { getRootProps, getInputProps, isDragActive } = dropzoneState;

  const removeFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/support/upload?id=${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast({
          title: "File removed",
          description: "The file has been removed successfully.",
        });
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to remove file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 text-center hover:border-primary/50 transition-colors cursor-pointer",
          isDragActive && "border-primary bg-primary/5",
          (uploading || files.length >= maxFiles) &&
            "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        {isDragActive ? (
          <p className="text-sm">Drop the files here...</p>
        ) : (
          <>
            <p className="text-sm">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.fileSize)}
                </p>
                {file.uploading && (
                  <Progress value={file.progress} className="h-1 mt-1" />
                )}
                {file.error && (
                  <p className="text-xs text-destructive mt-1">{file.error}</p>
                )}
              </div>
              {file.uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
