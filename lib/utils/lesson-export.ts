import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

interface LessonCompletionData {
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
}

interface UserInfo {
  name: string;
  avatar?: string | null;
}

/**
 * Generate a shareable image from lesson completion data
 */
export async function generateShareableImage(
  data: LessonCompletionData,
  userInfo: UserInfo,
  includePersonalInfo: boolean = true
): Promise<Blob> {
  try {
    // Dynamically import the ShareableAchievementCard component
    const { ShareableAchievementCard } = await import(
      "@/components/lessons/ShareableAchievementCard"
    );

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    document.body.appendChild(container);

    // Create React element
    const element = createElement(ShareableAchievementCard, {
      lessonTitle: data.lessonTitle,
      overallScore: data.overallScore,
      accuracy: data.accuracy,
      timeSpent: data.timeSpent,
      starRating: data.starRating,
      userName: includePersonalInfo ? userInfo.name : "Anonymous User",
      userAvatar: includePersonalInfo ? userInfo.avatar : null,
      completionDate: data.completionDate,
      conceptScores: data.conceptScores.map((c) => ({
        name: c.name,
        score: c.score,
      })),
    });

    // Render to container
    const root = createRoot(container);
    root.render(element);

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture with html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up
    root.unmount();
    document.body.removeChild(container);

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (error) {
    console.error("Error generating shareable image:", error);
    throw new Error("Failed to generate shareable image");
  }
}

/**
 * Download image file
 */
export function downloadImage(blob: Blob, lessonId: string): void {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `lesson-completion-${lessonId}-${date}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Image downloaded successfully!");
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image");
    throw error;
  }
}

/**
 * Copy image to clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.write) {
      throw new Error("Clipboard API not supported");
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    toast.success("Image copied to clipboard!");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    
    // Fallback: Show message to manually save
    toast.error("Clipboard not supported. Please use Download instead.");
    throw error;
  }
}

/**
 * Generate PDF report from lesson completion data
 */
export async function generatePDFReport(
  data: LessonCompletionData,
  userInfo: UserInfo,
  includePersonalInfo: boolean = true,
  includeDetailedStats: boolean = true
): Promise<jsPDF> {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let yPos = margin;

    // Helper function for page numbers
    const addPageNumber = (pageNum: number) => {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${pageNum}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    };

    // Helper function for headers
    const addHeader = (text: string) => {
      doc.setFillColor(59, 130, 246); // Primary color
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(text, margin + 5, yPos + 7);
      yPos += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    };

    // PAGE 1: Summary
    addHeader("Lesson Completion Summary");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Lesson:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.lessonTitle, margin + 30, yPos);
    yPos += lineHeight;

    if (includePersonalInfo) {
      doc.setFont("helvetica", "bold");
      doc.text("Student:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(userInfo.name, margin + 30, yPos);
      yPos += lineHeight;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Completed:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.completionDate.toLocaleDateString(), margin + 30, yPos);
    yPos += lineHeight * 2;

    // Overall Score - Large display
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Overall Score", margin, yPos);
    yPos += lineHeight;
    doc.setFontSize(36);
    doc.setTextColor(59, 130, 246);
    doc.text(`${data.overallScore}%`, margin, yPos);
    yPos += lineHeight * 2;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Key Metrics
    doc.setFont("helvetica", "bold");
    doc.text("Key Metrics", margin, yPos);
    yPos += lineHeight;
    doc.setFont("helvetica", "normal");

    doc.text(`Accuracy: ${data.accuracy}%`, margin + 5, yPos);
    yPos += lineHeight;
    doc.text(`Time Spent: ${data.timeSpent} minutes`, margin + 5, yPos);
    yPos += lineHeight;
    doc.text(`Rating: ${"★".repeat(data.starRating)}${"☆".repeat(5 - data.starRating)}`, margin + 5, yPos);
    
    addPageNumber(1);

    // PAGE 2: Concept Breakdown
    doc.addPage();
    yPos = margin;
    addHeader("Concept Breakdown");

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Concept", margin + 2, yPos + 5);
    doc.text("Score", pageWidth - margin - 30, yPos + 5);
    doc.text("Weight", pageWidth - margin - 15, yPos + 5);
    yPos += 10;

    // Table rows
    doc.setFont("helvetica", "normal");
    data.conceptScores.forEach((concept, index) => {
      if (yPos > pageHeight - 30) {
        addPageNumber(2);
        doc.addPage();
        yPos = margin;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 6, "F");
      }

      doc.text(concept.name.slice(0, 40), margin + 2, yPos);
      doc.text(`${concept.score}%`, pageWidth - margin - 30, yPos);
      doc.text(`${concept.weight}`, pageWidth - margin - 15, yPos);
      yPos += 6;
    });

    addPageNumber(2);

    // PAGE 3: General Exercises & Insights
    if (includeDetailedStats) {
      doc.addPage();
      yPos = margin;
      addHeader("General Exercises & Performance Insights");

      doc.setFont("helvetica", "bold");
      doc.text("General Exercise Score:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(59, 130, 246);
      doc.text(`${data.generalExerciseScore}%`, margin + 60, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += lineHeight * 2;

      // Strengths
      doc.setFont("helvetica", "bold");
      doc.text("Strengths:", margin, yPos);
      yPos += lineHeight;
      doc.setFont("helvetica", "normal");
      data.insights.strengths.forEach((strength) => {
        doc.text(`• ${strength}`, margin + 5, yPos);
        yPos += lineHeight;
      });
      yPos += lineHeight;

      // Weaknesses
      doc.setFont("helvetica", "bold");
      doc.text("Areas for Improvement:", margin, yPos);
      yPos += lineHeight;
      doc.setFont("helvetica", "normal");
      data.insights.weaknesses.forEach((weakness) => {
        doc.text(`• ${weakness}`, margin + 5, yPos);
        yPos += lineHeight;
      });

      addPageNumber(3);

      // PAGE 4: Analytics
      doc.addPage();
      yPos = margin;
      addHeader("Performance Analytics");

      const analytics = [
        { label: "Average Time per Concept", value: `${data.analytics.averageTimePerConcept} min` },
        { label: "Total Attempts", value: data.analytics.totalAttempts.toString() },
        { label: "Improvement Rate", value: `${data.analytics.improvementRate}%` },
      ];

      analytics.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${item.label}:`, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(item.value, margin + 70, yPos);
        yPos += lineHeight;
      });

      addPageNumber(4);

      // PAGE 5: Recommendations
      doc.addPage();
      yPos = margin;
      addHeader("Recommendations & Next Steps");

      doc.setFont("helvetica", "normal");
      data.insights.recommendations.forEach((rec) => {
        if (yPos > pageHeight - 30) {
          addPageNumber(5);
          doc.addPage();
          yPos = margin;
        }
        doc.text(`• ${rec}`, margin + 5, yPos);
        yPos += lineHeight;
      });

      addPageNumber(5);
    }

    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
}

/**
 * Download PDF file
 */
export function downloadPDF(pdf: jsPDF, lessonId: string): void {
  try {
    const date = new Date().toISOString().split("T")[0];
    pdf.save(`lesson-report-${lessonId}-${date}.pdf`);
    toast.success("PDF downloaded successfully!");
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Failed to download PDF");
    throw error;
  }
}
