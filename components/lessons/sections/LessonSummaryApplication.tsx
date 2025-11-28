import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonContent } from "@/lib/types/lessons";

interface LessonSummaryApplicationProps {
  lesson: LessonContent;
}

export function LessonSummaryApplication({ lesson }: LessonSummaryApplicationProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="h-full bg-card">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.summary}
            </p>
          </CardContent>
        </Card>

        <Card className="h-full bg-card">
          <CardHeader>
            <CardTitle className="text-base">Application</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.application}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
