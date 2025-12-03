import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lightbulb, Sparkles } from "lucide-react";
import { LessonContent } from "@/lib/types/lessons";

interface LessonSummaryApplicationProps {
  lesson: LessonContent;
}

export function LessonSummaryApplication({
  lesson,
}: LessonSummaryApplicationProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Summary Card */}
        <Card className="h-full border-2 bg-gradient-to-br from-blue-50/50 via-background to-background shadow-lg dark:from-blue-950/20 dark:via-background dark:to-background">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <FileText className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Summary</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Key takeaways from this lesson
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground">
              {lesson.summary}
            </p>
          </CardContent>
        </Card>

        {/* Application Card */}
        <Card className="h-full border-2 bg-gradient-to-br from-purple-50/50 via-background to-background shadow-lg dark:from-purple-950/20 dark:via-background dark:to-background">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Lightbulb className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Application</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  How to apply what you&apos;ve learned
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground">
              {lesson.application}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
