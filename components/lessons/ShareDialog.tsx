"use client";

import { useState } from "react";
import { Share2, Download, Copy, FileText, Settings, Info, Link } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSharingPreferences } from "@/hooks/use-sharing-preferences";
import {
  generateShareableImage,
  downloadImage,
  copyImageToClipboard,
  generatePDFReport,
  downloadPDF,
} from "@/lib/utils/lesson-export";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonData: {
    lessonId: string;
    lessonTitle: string;
    overallScore: number;
    accuracy: number;
    timeSpent: number;
    starRating: number;
    completionDate: Date;
    conceptScores: { name: string; score: number; weight: number }[];
    generalExerciseScore: number;
    insights: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    analytics: {
      averageTimePerConcept: number;
      totalAttempts: number;
      improvementRate: number;
    };
  };
  userInfo: {
    name: string;
    avatar?: string | null;
  };
}

export function ShareDialog({
  open,
  onOpenChange,
  lessonData,
  userInfo,
}: ShareDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const { preferences, updatePreference } = useSharingPreferences();

  const handleDownloadImage = async () => {
    if (!preferences.allowSharing) {
      toast.error("Sharing is disabled in your privacy settings.");
      return;
    }

    try {
      setIsGenerating(true);
      setActiveOperation("image-download");

      const blob = await generateShareableImage(
        lessonData,
        userInfo,
        preferences.includePersonalInfo
      );

      downloadImage(blob, lessonData.lessonId);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    } finally {
      setIsGenerating(false);
      setActiveOperation(null);
    }
  };

  const handleCopyImage = async () => {
    if (!preferences.allowSharing) {
      toast.error("Sharing is disabled in your privacy settings.");
      return;
    }

    try {
      setIsGenerating(true);
      setActiveOperation("image-copy");

      const blob = await generateShareableImage(
        lessonData,
        userInfo,
        preferences.includePersonalInfo
      );

      await copyImageToClipboard(blob);
    } catch (error) {
      // Error already handled in copyImageToClipboard with toast
      console.error("Error copying image:", error);
    } finally {
      setIsGenerating(false);
      setActiveOperation(null);
    }
  };

  const handleDownloadPDF = async () => {
    if (!preferences.allowSharing) {
      toast.error("Sharing is disabled in your privacy settings.");
      return;
    }

    try {
      setIsGenerating(true);
      setActiveOperation("pdf-download");

      const pdf = await generatePDFReport(
        lessonData,
        userInfo,
        preferences.includePersonalInfo,
        preferences.includeDetailedStats
      );

      downloadPDF(pdf, lessonData.lessonId);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setActiveOperation(null);
    }
  };

  const handleCopyShareLink = async () => {
    if (!preferences.allowSharing) {
      toast.error("Sharing is disabled in your privacy settings.");
      return;
    }

    try {
      setIsGenerating(true);
      setActiveOperation("link-copy");

      // Generate shareable URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/lessons/${lessonData.lessonId}/completion?score=${lessonData.overallScore}`;

      // Try to use Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } else {
        // Fallback: create temporary input and copy
        const tempInput = document.createElement("input");
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        toast.success("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error copying share link:", error);
      toast.error("Failed to copy link. Please try again.");
    } finally {
      setIsGenerating(false);
      setActiveOperation(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5" />
            Share Your Achievement
          </DialogTitle>
          <DialogDescription>
            Download or share your lesson completion achievement. Choose your
            preferred format below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview Section */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              Achievement Preview
            </h3>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{lessonData.lessonTitle}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Score: {lessonData.overallScore}%</span>
                  <span>•</span>
                  <span>Accuracy: {lessonData.accuracy}%</span>
                  <span>•</span>
                  <span>Time: {lessonData.timeSpent} min</span>
                </div>
                {preferences.includePersonalInfo && (
                  <p className="text-sm text-muted-foreground">
                    Student: {userInfo.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Privacy Settings</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    <p className="text-xs">
                      Control what information is included in your shared
                      achievement card and PDF reports.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-sharing"
                  checked={preferences.allowSharing}
                  onCheckedChange={(checked) =>
                    updatePreference("allowSharing", checked === true)
                  }
                />
                <Label
                  htmlFor="allow-sharing"
                  className="cursor-pointer text-sm font-normal"
                >
                  Enable sharing features (uncheck to opt-out)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-personal"
                  checked={preferences.includePersonalInfo}
                  disabled={!preferences.allowSharing}
                  onCheckedChange={(checked) =>
                    updatePreference("includePersonalInfo", checked === true)
                  }
                />
                <Label
                  htmlFor="include-personal"
                  className="cursor-pointer text-sm font-normal"
                >
                  Include my name and photo in shared content
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-stats"
                  checked={preferences.includeDetailedStats}
                  disabled={!preferences.allowSharing}
                  onCheckedChange={(checked) =>
                    updatePreference("includeDetailedStats", checked === true)
                  }
                />
                <Label
                  htmlFor="include-stats"
                  className="cursor-pointer text-sm font-normal"
                >
                  Include detailed performance statistics in PDF
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Export Options</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleDownloadImage}
                disabled={isGenerating || !preferences.allowSharing}
              >
                <Download className="mr-2 size-4" />
                {activeOperation === "image-download"
                  ? "Generating..."
                  : "Download Achievement Card (PNG)"}
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={handleCopyImage}
                disabled={isGenerating || !preferences.allowSharing}
              >
                <Copy className="mr-2 size-4" />
                {activeOperation === "image-copy"
                  ? "Generating..."
                  : "Copy Image to Clipboard"}
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={handleDownloadPDF}
                disabled={isGenerating || !preferences.allowSharing}
              >
                <FileText className="mr-2 size-4" />
                {activeOperation === "pdf-download"
                  ? "Generating..."
                  : "Download Detailed Report (PDF)"}
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={handleCopyShareLink}
                disabled={isGenerating || !preferences.allowSharing}
              >
                <Link className="mr-2 size-4" />
                {activeOperation === "link-copy"
                  ? "Copying..."
                  : "Copy Share Link"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
