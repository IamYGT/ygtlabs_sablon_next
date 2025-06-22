"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X, Eye, Trash2, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    description?: string;
    className?: string;
    accept?: string;
    maxSize?: number; // in MB
    uploadEndpoint?: string;
}

export function ImageUpload({
    value,
    onChange,
    label = "Görsel",
    description = "Görsel yükleyin veya URL girin",
    className,
    accept = "image/*",
    maxSize = 5,
    uploadEndpoint = "/api/upload/hero-slider"
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const validateFile = (file: File): string | null => {
        if (!file.type.startsWith('image/')) {
            return "Sadece görsel dosyaları desteklenir";
        }

        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`;
        }

        return null;
    };

    const uploadFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Simulated progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            const response = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();
            onChange(data.url);

            setTimeout(() => {
                setUploadProgress(0);
                setIsUploading(false);
            }, 500);

        } catch (error) {
            console.error("Upload error:", error);
            setError(error instanceof Error ? error.message : "Upload failed");
            setUploadProgress(0);
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput("");
            setShowUrlInput(false);
        }
    };

    const removeImage = () => {
        onChange("");
        setError(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn("space-y-4", className)}>
            {label && <Label>{label}</Label>}
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}

            {/* Current Image Preview */}
            {value && (
                <div className="relative group">
                    <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setPreviewOpen(true)}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={removeImage}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {!value && (
                <div
                    className={cn(
                        "relative w-full h-48 rounded-lg border-2 border-dashed transition-colors duration-200",
                        isDragging
                            ? "border-primary bg-primary/10"
                            : "border-gray-300 hover:border-gray-400",
                        isUploading && "pointer-events-none"
                    )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        {isUploading ? (
                            <>
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                <p className="text-sm font-medium">Yükleniyor...</p>
                                <div className="w-full max-w-xs mt-2">
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Dosyayı sürükleyip bırakın
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                    veya dosya seçmek için tıklayın
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Dosya Seç
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowUrlInput(true)}
                                    >
                                        <Link className="w-4 h-4 mr-1" />
                                        URL
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Maksimum {maxSize}MB, JPG, PNG, WebP
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* URL Input Dialog */}
            <Dialog open={showUrlInput} onOpenChange={setShowUrlInput}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Görsel URL'si Girin</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowUrlInput(false)}>
                                İptal
                            </Button>
                            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                                Ekle
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Full Size Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Görsel Önizleme</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 pt-0">
                        {value && (
                            <img
                                src={value}
                                alt="Full size preview"
                                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Upload Actions */}
            {value && (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-4 h-4 mr-1" />
                        Değiştir
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUrlInput(true)}
                    >
                        <Link className="w-4 h-4 mr-1" />
                        URL ile Değiştir
                    </Button>
                </div>
            )}
        </div>
    );
} 