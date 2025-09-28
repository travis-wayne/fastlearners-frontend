"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Target,
  Users,
  FileText,
  PlayCircle,
  Award,
  TrendingUp,
  Download,
  Share2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import { useAcademicContext, useAcademicDisplay } from "@/components/providers/academic-context";
import { getSubjectById } from "@/config/education";
import { mockSchemeOfWork } from "@/data/mock-scheme-of-work";

// Mock data for subject progress
const mockSubjectProgress = {
  totalTopics: 12,
  completedTopics: 8,
  currentWeek: 9,
  totalWeeks: 11,
  upcomingAssessments: 2,
  lastAccessed: "2 hours ago",
  termProgress: 75,
  grade: "B2",
  caScore: 82,
};

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.id as string;
  
  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const subject = getSubjectById(subjectId);
  
  // Get scheme of work for current subject, class, and term
  const getSchemeOfWork = () => {
    const key = `${subjectId}${currentClass?.stage?.toUpperCase()}${currentClass?.level}Term${currentTerm?.order}`;
    // For demo, we'll use the JSS1 Term1 schemes we have
    if (subjectId === 'mathematics') return mockSchemeOfWork.mathematicsJSS1Term1;
    if (subjectId === 'english') return mockSchemeOfWork.englishJSS1Term1;
    if (subjectId === 'basic-science') return mockSchemeOfWork.basicScienceJSS1Term1;
    
    // Return null if no scheme found
    return null;
  };

  const schemeOfWork = getSchemeOfWork();

  if (!subject) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Subject Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The subject you&apos;re looking for doesn&apos;t exist or isn&apos;t available.
              </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Class and Term</h3>
            <p className="text-muted-foreground mb-4">
              Please select your class and term to view the scheme of work.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                <BookOpen className="size-5" style={{ color: subject.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{subject.name}</h1>
                <p className="text-muted-foreground">{subject.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{classDisplay}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{termDisplay}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Code: {subject.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AcademicSelector variant="compact" />
            <Button variant="outline" size="sm">
              <Share2 className="size-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Subject Overview Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{mockSubjectProgress.termProgress}%</p>
                <Progress value={mockSubjectProgress.termProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Current Grade</span>
              </div>
              <p className="text-2xl font-bold">{mockSubjectProgress.grade}</p>
              <p className="text-sm text-muted-foreground">CA: {mockSubjectProgress.caScore}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Current Week</span>
              </div>
              <p className="text-2xl font-bold">{mockSubjectProgress.currentWeek}</p>
              <p className="text-sm text-muted-foreground">of {mockSubjectProgress.totalWeeks} weeks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Assessments</span>
              </div>
              <p className="text-2xl font-bold">{mockSubjectProgress.upcomingAssessments}</p>
              <p className="text-sm text-muted-foreground">upcoming</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="scheme" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheme">Scheme of Work</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="scheme" className="space-y-4">
            {schemeOfWork ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scheme of Work</CardTitle>
                      <CardDescription>
                        {subject.name} for {classDisplay} - {termDisplay}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="size-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {schemeOfWork.weeks.map((week, index) => (
                      <AccordionItem key={week.week} value={`week-${week.week}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              {week.week <= mockSubjectProgress.currentWeek ? (
                                <CheckCircle className="size-5 text-green-600" />
                              ) : (
                                <Circle className="size-5 text-muted-foreground" />
                              )}
                              <span className="font-semibold">Week {week.week}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{week.topics.join(", ")}</span>
                            </div>
                            {week.week === mockSubjectProgress.currentWeek && (
                              <Badge variant="default" className="ml-auto">Current</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <BookOpen className="size-4" />
                                  Topics
                                </h4>
                                <ul className="space-y-1">
                                  {week.topics.map((topic, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <Target className="size-4" />
                                  Learning Objectives
                                </h4>
                                <ul className="space-y-1">
                                  {week.objectives.map((objective, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                      {objective}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <PlayCircle className="size-4" />
                                  Activities
                                </h4>
                                <ul className="space-y-1">
                                  {week.activities.map((activity, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <FileText className="size-4" />
                                  Resources
                                </h4>
                                <ul className="space-y-1">
                                  {week.resources.map((resource, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <Award className="size-4" />
                                  Assessment
                                </h4>
                                <p className="text-sm text-muted-foreground">{week.assessment}</p>
                              </div>
                            </div>
                          </div>

                          {week.week <= mockSubjectProgress.currentWeek && (
                            <div className="mt-6 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle className="size-4" />
                                  <span>Week completed</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  View Lessons
                                </Button>
                              </div>
                            </div>
                          )}

                          {week.week === mockSubjectProgress.currentWeek && (
                            <div className="mt-6 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                  <Clock className="size-4" />
                                  <span>Currently studying this week</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Continue Lesson
                                  </Button>
                                  <Button size="sm">
                                    Take Quiz
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scheme of Work Available</h3>
                  <p className="text-muted-foreground">
                    The scheme of work for {subject.name} in {classDisplay} - {termDisplay} is not yet available.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <PlayCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lessons Coming Soon</h3>
                <p className="text-muted-foreground">
                  Interactive lessons for {subject.name} will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Assessments Coming Soon</h3>
                <p className="text-muted-foreground">
                  Quizzes and assessments for {subject.name} will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Resources Coming Soon</h3>
                <p className="text-muted-foreground">
                  Additional resources and materials for {subject.name} will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}