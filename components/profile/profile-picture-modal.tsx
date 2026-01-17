"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ImageCropper } from "@/components/profile/image-cropper";
import { uploadProfilePicture } from "@/lib/api/profile";
import { useAuthStore } from "@/store/authStore";
import { invalidateAvatarCache } from "@/components/shared/user-avatar";

interface ProfilePictureModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentAvatar?: string | null;
  onUploadSuccess?: (avatarUrl: string) => void;
}

type ModalStep = "select" | "crop" | "uploading";

export function ProfilePictureModal({
  showModal,
  setShowModal,
  currentAvatar,
  onUploadSuccess,
}: ProfilePictureModalProps) {
  const [step, setStep] = useState<ModalStep>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
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

    // Validate file size (5MB for pre-crop, will be compressed after)
    if (file.size > 5 * 1048576) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview URL for cropping
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setStep("crop");
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob);
    // Create preview URL for the cropped image
    const url = URL.createObjectURL(blob);
    setCroppedPreviewUrl(url);
    setStep("select");
  };

  const handleCropCancel = () => {
    // Go back to selection but keep the file selected
    setStep("select");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedBlob(null);
    if (croppedPreviewUrl) {
      URL.revokeObjectURL(croppedPreviewUrl);
      setCroppedPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setStep("select");
  };

  const handleUpload = async () => {
    // Use cropped blob if available, otherwise use original file
    const fileToUpload = croppedBlob
      ? new File([croppedBlob], selectedFile?.name || "profile.jpg", {
          type: "image/jpeg",
        })
      : selectedFile;

    if (!fileToUpload) return;

    setIsUploading(true);
    setStep("uploading");

    try {
      const avatarUrl = await uploadProfilePicture(fileToUpload);

      // Invalidate avatar cache to force refresh across all components
      invalidateAvatarCache();

      // Update auth store with new avatar
      updateUserProfile({ avatar: avatarUrl } as any);

      toast.success("Profile picture updated successfully!");
      onUploadSuccess?.(avatarUrl);
      setShowModal(false);

      // Reset state
      handleRemoveFile();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
      setStep("select");
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

  const handleEditCrop = () => {
    if (previewUrl) {
      setStep("crop");
    }
  };

  // Get the display preview - cropped version if available, otherwise original
  const displayPreview = croppedPreviewUrl || previewUrl;

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
            {step === "crop"
              ? "Crop and adjust your image before uploading."
              : "Upload a new profile picture. Max size: 5MB. Formats: PNG, JPG, WEBP."}
          </DialogDescription>
        </div>

        {/* Crop Step */}
        {step === "crop" && previewUrl && (
          <ImageCropper
            imageSrc={previewUrl}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={1}
            circularCrop={true}
          />
        )}

        {/* Select/Preview Step */}
        {step !== "crop" && (
          <>
            {/* Preview Area */}
            <div className="mb-6">
              <div className="relative mx-auto flex size-40 items-center justify-center overflow-hidden rounded-full bg-muted">
                {displayPreview ? (
                  <Image
                    src={displayPreview}
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

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="size-8 animate-spin text-primary" />
                  </div>
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
                  <span className="text-sm font-medium">
                    {croppedBlob ? "Cropped image ready" : selectedFile.name}
                  </span>
                </div>
                {!isUploading && (
                  <div className="flex items-center gap-1">
                    {previewUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCrop}
                        className="h-8 px-2 text-xs"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="size-8 p-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
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
          </>
        )}
      </div>
    </Modal>
  );
}
