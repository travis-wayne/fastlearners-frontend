import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function QuizDummyPage() {
  return (
    <div className="flex h-full flex-col space-y-6 lg:p-4">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto max-w-md border-2 border-dashed bg-blue-50/50 shadow-none duration-500 animate-in fade-in zoom-in dark:bg-blue-900/10">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <HelpCircle className="size-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-100">Quizzes Coming Soon!</h2>
              <p className="text-sm text-muted-foreground">
                We are working hard to bring you interactive and challenging quizzes to help you test your understanding of the concepts you have learned. Check back later!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
