"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { uploadProfilePicture } from "@/lib/api/profile";
import { useAuthStore } from "@/store/authStore";

interface ProfilePictureModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentAvatar?: string | null;
  onUploadSuccess?: (avatarUrl: string) => void;
}

export function ProfilePictureModal({
  showModal,
  setShowModal,
  currentAvatar,
  onUploadSuccess,
}: ProfilePictureModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUserProfile } = useAuthStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select a PNG, JPG, JPEG, or WEBP image.");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1048576) {
      toast.error("File size must be less than 1MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const avatarUrl = await uploadProfilePicture(selectedFile);

      // Update auth store with new avatar
      updateUserProfile({ avatar: avatarUrl } as any);

      toast.success("Profile picture updated successfully!");
      onUploadSuccess?.(avatarUrl);
      setShowModal(false);

      // Reset state
      handleRemoveFile();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      handleRemoveFile();
      setShowModal(false);
    }
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={handleClose}
      preventDefaultClose={isUploading}
      className="max-w-md"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. Max size: 1MB. Formats: PNG, JPG, WEBP.
          </DialogDescription>
        </div>

        {/* Preview Area */}
        <div className="mb-6">
          <div className="relative mx-auto flex size-40 items-center justify-center overflow-hidden rounded-full bg-muted">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : currentAvatar ? (
              <Image
                src={currentAvatar}
                alt="Current profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Camera className="size-12 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Selected File Display */}
        {selectedFile && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!selectedFile ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 size-4" />
                Choose File
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                Change File
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 size-4" />
                    Upload
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
