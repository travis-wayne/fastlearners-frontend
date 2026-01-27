"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  circularCrop?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  circularCrop = true,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    },
    [aspectRatio]
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("No 2d context");
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the cropped area
    const outputSize = 256; // Fixed output size for profile pictures
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Calculate the center of the canvas
    const centerX = outputSize / 2;
    const centerY = outputSize / 2;

    // Save the context state
    ctx.save();

    // Move to center, rotate, then draw
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );

    // Restore the context state
    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/jpeg",
      0.95
    );
  }, [completedCrop, rotate, scale, onCropComplete]);

  const handleRotateLeft = () => {
    setRotate((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Crop Area */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-muted/50">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          circularCrop={circularCrop}
          className="max-h-[300px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              maxHeight: "300px",
              maxWidth: "100%",
            }}
            className="object-contain"
          />
        </ReactCrop>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Zoom Control */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="size-8"
          >
            <ZoomOut className="size-4" />
          </Button>
          <div className="flex-1">
            <Slider
              value={[scale]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={([value]) => setScale(value)}
              className="w-full"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="size-8"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>

        {/* Rotate Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRotateLeft}
            className="gap-1"
          >
            <RotateCcw className="size-4" />
            Rotate Left
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRotateRight}
            className="gap-1"
          >
            <RotateCw className="size-4" />
            Rotate Right
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" className="flex-1" onClick={handleCropComplete}>
          Apply Crop
        </Button>
      </div>
    </div>
  );
}
