"use client";

import { useState, useEffect } from "react";
import { VideoOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getYouTubeEmbedUrl } from "@/lib/utils/media";

interface YouTubeEmbedProps {
  src: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ src, title, className }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(src);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={cn("relative w-full aspect-video bg-muted/20 rounded-lg", className)}>
      {!isLoaded && !hasError && <Skeleton className="absolute inset-0 size-full rounded-lg" />}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
          <VideoOff className="mb-2 size-8 opacity-50" />
          <span className="text-xs font-medium">Failed to load media</span>
        </div>
      )}

      {embedUrl ? (
        <iframe
          src={embedUrl}
          className={cn("size-full rounded-lg transition-opacity duration-300", (!isLoaded || hasError) && "opacity-0")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title ?? "Lesson Video"}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setIsLoaded(true); setHasError(true); }}
        />
      ) : (
        <video
          controls
          className={cn("size-full rounded-lg transition-opacity duration-300", (!isLoaded || hasError) && "opacity-0")}
          src={src}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => { setIsLoaded(true); setHasError(true); }}
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

