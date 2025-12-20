"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  FileText,
  Play,
  Search,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

const mockPastQuestions = [
  {
    id: 1,
    exam: "WAEC",
    year: 2023,
    subject: "Mathematics",
    questions: 50,
    attempted: true,
    score: 85,
  },
  {
    id: 2,
    exam: "WAEC",
    year: 2022,
    subject: "English",
    questions: 60,
    attempted: false,
  },
  {
    id: 3,
    exam: "NECO",
    year: 2023,
    subject: "Physics",
    questions: 40,
    attempted: true,
    score: 78,
  },
  {
    id: 4,
    exam: "JAMB",
    year: 2023,
    subject: "Use of English",
    questions: 60,
    attempted: false,
  },
];

export default function PastQuestionsPage() {
  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredQuestions = mockPastQuestions.filter((q) => {
    const matchesSearch = q.subject
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesExam = selectedExam === "all" || q.exam === selectedExam;
    const matchesYear =
      selectedYear === "all" || q.year.toString() === selectedYear;
    return matchesSearch && matchesExam && matchesYear;
  });

  if (!currentClass || !currentTerm) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container space-y-6 pb-20"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <FileText className="size-8 text-primary" />
            Past Questions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Practice with previous examination questions
          </p>
        </div>
        <AcademicSelector variant="compact" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold">{mockPastQuestions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-green-600" />
              <span className="text-sm text-muted-foreground">WAEC</span>
            </div>
            <p className="text-2xl font-bold">
              {mockPastQuestions.filter((q) => q.exam === "WAEC").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">NECO</span>
            </div>
            <p className="text-2xl font-bold">
              {mockPastQuestions.filter((q) => q.exam === "NECO").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award className="size-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">JAMB</span>
            </div>
            <p className="text-2xl font-bold">
              {mockPastQuestions.filter((q) => q.exam === "JAMB").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="WAEC">WAEC</SelectItem>
                <SelectItem value="NECO">NECO</SelectItem>
                <SelectItem value="JAMB">JAMB</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {question.subject}
                  </CardTitle>
                  <CardDescription>
                    {question.exam} {question.year}
                  </CardDescription>
                </div>
                <Badge variant={question.attempted ? "default" : "secondary"}>
                  {question.attempted ? "Attempted" : "New"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {question.questions} Questions
              </div>
              {question.attempted && question.score && (
                <div className="text-sm">
                  <span className="font-medium">Best Score: </span>
                  <span className="text-green-600">{question.score}%</span>
                </div>
              )}
              <Button size="sm" className="w-full">
                <Play className="mr-1 size-3" />
                {question.attempted ? "Practice Again" : "Start Practice"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No Past Questions Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
