"use client";

import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export function AudioPlayer({ src, title = "Audio", className }: AudioPlayerProps) {
  return (
    <Card className={cn("border", className)}>
      <CardHeader className="p-3 pb-2 sm:p-4 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Volume2 className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
        <audio controls className="w-full">
          <source src={src} />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
}
