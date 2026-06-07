import { getGrade } from "@/lib/utils/grading";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SubjectScoreRowProps {
  subjectName: string;
  score: number;
  onClick?: () => void;
  showProgress?: boolean;
}

export function SubjectScoreRow({
  subjectName,
  score,
  onClick,
  showProgress = true,
}: SubjectScoreRowProps) {
  const gradeInfo = getGrade(score);

  const content = (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-base font-medium">{subjectName}</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{score}%</span>
          {score === 0 ? (
            <span className="text-xs text-muted-foreground">Not started</span>
          ) : (
            <Badge className={gradeInfo.colorClass}>{gradeInfo.letter}</Badge>
          )}
        </div>
      </div>
      {showProgress && <Progress value={score} className="h-2" />}
    </div>
  );

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted/50"
      >
        {content}
      </div>
    );
  }

  return content;
}
