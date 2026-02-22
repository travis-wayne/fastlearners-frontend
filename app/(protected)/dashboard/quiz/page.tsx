import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function QuizDummyPage() {
  return (
    <div className="flex h-full flex-col space-y-6 lg:p-4">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto max-w-md animate-in fade-in zoom-in duration-500 border-2 border-dashed shadow-none bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <HelpCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
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
