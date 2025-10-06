"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  Calendar,
  Download,
  FileText,
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

const mockGrades = [
  {
    subject: "Mathematics",
    ca: 85,
    exam: 78,
    total: 81.5,
    grade: "A",
    position: 3,
    remarks: "Excellent",
  },
  {
    subject: "English",
    ca: 78,
    exam: 82,
    total: 80,
    grade: "A",
    position: 5,
    remarks: "Very Good",
  },
  {
    subject: "Basic Science",
    ca: 88,
    exam: 76,
    total: 82,
    grade: "A",
    position: 2,
    remarks: "Excellent",
  },
  {
    subject: "Social Studies",
    ca: 75,
    exam: 68,
    total: 71.5,
    grade: "B",
    position: 8,
    remarks: "Good",
  },
  {
    subject: "Civic Education",
    ca: 82,
    exam: 85,
    total: 83.5,
    grade: "A",
    position: 1,
    remarks: "Outstanding",
  },
];

const mockTerms = [
  { term: "1st Term", average: 78.5, position: 4, total: 125 },
  { term: "2nd Term", average: 82.1, position: 3, total: 130 },
  { term: "3rd Term", average: 79.8, position: 5, total: 128 },
];

export default function RecordsPage() {
  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const [selectedTerm, setSelectedTerm] = useState("current");

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view records.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallAverage =
    mockGrades.reduce((sum, grade) => sum + grade.total, 0) / mockGrades.length;
  const currentTermRecord =
    mockTerms.find((t) => t.term === "1st Term") || mockTerms[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto space-y-6 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <BarChart3 className="size-8 text-primary" />
            Academic Records
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your academic performance for {classDisplay}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AcademicSelector variant="compact" />
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Overall Average
              </span>
            </div>
            <p className="text-2xl font-bold">{overallAverage.toFixed(1)}%</p>
            <Badge variant="secondary" className="mt-2">
              Grade A
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award className="size-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Class Position
              </span>
            </div>
            <p className="text-2xl font-bold">{currentTermRecord.position}</p>
            <p className="text-sm text-muted-foreground">
              out of {currentTermRecord.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Subjects</span>
            </div>
            <p className="text-2xl font-bold">{mockGrades.length}</p>
            <p className="text-sm text-muted-foreground">offered</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award className="size-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">A Grades</span>
            </div>
            <p className="text-2xl font-bold">
              {mockGrades.filter((g) => g.grade === "A").length}
            </p>
            <p className="text-sm text-muted-foreground">subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="current" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="current">Current Term</TabsTrigger>
            <TabsTrigger value="history">Term History</TabsTrigger>
            <TabsTrigger value="progress">Progress Chart</TabsTrigger>
          </TabsList>

          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Term</SelectItem>
              <SelectItem value="1st">1st Term</SelectItem>
              <SelectItem value="2nd">2nd Term</SelectItem>
              <SelectItem value="3rd">3rd Term</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance - {termDisplay}</CardTitle>
              <CardDescription>
                Detailed breakdown of your performance in each subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">CA (40%)</TableHead>
                    <TableHead className="text-center">Exam (60%)</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Position</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGrades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {grade.subject}
                      </TableCell>
                      <TableCell className="text-center">{grade.ca}</TableCell>
                      <TableCell className="text-center">
                        {grade.exam}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {grade.total}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            grade.grade === "A"
                              ? "default"
                              : grade.grade === "B"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {grade.position}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm ${
                            grade.remarks === "Outstanding" ||
                            grade.remarks === "Excellent"
                              ? "text-green-600"
                              : grade.remarks === "Very Good"
                                ? "text-blue-600"
                                : grade.remarks === "Good"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                          }`}
                        >
                          {grade.remarks}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Term History</CardTitle>
              <CardDescription>
                Your academic performance across different terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTerms.map((term, index) => (
                  <Card key={index} className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold">{term.term}</h3>
                      <Badge variant="outline">
                        {term.average.toFixed(1)}% Average
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Class Position:{" "}
                        </span>
                        <span className="font-medium">
                          {term.position} of {term.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Grade: </span>
                        <span className="font-medium">
                          {term.average >= 80
                            ? "A"
                            : term.average >= 70
                              ? "B"
                              : term.average >= 60
                                ? "C"
                                : "D"}
                        </span>
                      </div>
                    </div>
                    <Progress value={term.average} className="mt-3 h-2" />
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Visual representation of your academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockGrades.map((subject, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.total}%
                      </span>
                    </div>
                    <Progress value={subject.total} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
