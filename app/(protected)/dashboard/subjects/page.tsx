"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Target, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import { SubjectCard } from "@/components/dashboard/student/shared/subject-card";
import { useAcademicContext, useAcademicDisplay } from "@/components/providers/academic-context";
import { getCompulsorySubjectsForClass, getElectiveSubjectsForClass, Subject } from "@/config/education";

// Mock data for subject progress - this would come from API
const mockSubjectProgress = {
  english: {
    totalTopics: 12,
    completedTopics: 8,
    currentWeek: 9,
    totalWeeks: 13,
    upcomingAssessments: 2,
    lastAccessed: "2 hours ago",
    termProgress: 67,
    grade: "B3",
    caScore: 78,
  },
  mathematics: {
    totalTopics: 15,
    completedTopics: 10,
    currentWeek: 8,
    totalWeeks: 13,
    upcomingAssessments: 1,
    lastAccessed: "Yesterday",
    termProgress: 75,
    grade: "B2",
    caScore: 82,
  },
  "basic-science": {
    totalTopics: 10,
    completedTopics: 6,
    currentWeek: 7,
    totalWeeks: 12,
    upcomingAssessments: 3,
    lastAccessed: "3 days ago",
    termProgress: 58,
    grade: "C4",
    caScore: 65,
  },
  "social-studies": {
    totalTopics: 8,
    completedTopics: 8,
    currentWeek: 10,
    totalWeeks: 11,
    upcomingAssessments: 0,
    lastAccessed: "Today",
    termProgress: 90,
    grade: "A1",
    caScore: 92,
  },
  "basic-technology": {
    totalTopics: 9,
    completedTopics: 4,
    currentWeek: 5,
    totalWeeks: 11,
    upcomingAssessments: 2,
    lastAccessed: "1 week ago",
    termProgress: 42,
    grade: "C5",
    caScore: 58,
  },
  "business-studies": {
    totalTopics: 7,
    completedTopics: 3,
    currentWeek: 4,
    totalWeeks: 10,
    upcomingAssessments: 1,
    lastAccessed: "5 days ago",
    termProgress: 35,
    caScore: 45,
  },
};

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  
  const { currentClass, availableSubjects } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  // Filter subjects based on current class
  const compulsorySubjects = currentClass ? getCompulsorySubjectsForClass(currentClass.id) : [];
  const electiveSubjects = currentClass ? getElectiveSubjectsForClass(currentClass.id) : [];

  // Filter subjects based on search and track
  const filterSubjects = (subjects: Subject[]) => {
    return subjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          subject.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTrack = selectedTrack === "all" || 
                          (selectedTrack === "core" && subject.compulsory) ||
                          (selectedTrack === "elective" && !subject.compulsory) ||
                          subject.track === selectedTrack;

      return matchesSearch && matchesTrack;
    });
  };

  const filteredCompulsorySubjects = filterSubjects(compulsorySubjects);
  const filteredElectiveSubjects = filterSubjects(electiveSubjects);

  // Calculate overall stats
  const totalSubjects = availableSubjects.length;
  const completedSubjects = availableSubjects.filter(subject => {
    const progress = mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress];
    return progress?.termProgress >= 90;
  }).length;
  
  const averageProgress = availableSubjects.length > 0 
    ? Math.round(availableSubjects.reduce((acc, subject) => {
        const progress = mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress];
        return acc + (progress?.termProgress || 0);
      }, 0) / availableSubjects.length)
    : 0;

  const upcomingAssessments = availableSubjects.reduce((acc, subject) => {
    const progress = mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress];
    return acc + (progress?.upcomingAssessments || 0);
  }, 0);

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

  if (!currentClass) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Your Class</h3>
            <p className="text-muted-foreground mb-4">
              Please select your class and term to view your subjects.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Subjects</h1>
            <p className="text-muted-foreground">
              Your subjects for {classDisplay} - {termDisplay}
            </p>
          </div>
          <AcademicSelector variant="compact" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Subjects</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalSubjects}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-1">{completedSubjects}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Avg Progress</span>
              </div>
              <p className="text-2xl font-bold mt-1">{averageProgress}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Assessments</span>
              </div>
              <p className="text-2xl font-bold mt-1">{upcomingAssessments}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-[180px]">
              <Filter className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="core">Core Subjects</SelectItem>
              <SelectItem value="elective">Elective Subjects</SelectItem>
              {currentClass.track && (
                <SelectItem value={currentClass.track}>
                  {currentClass.track.charAt(0).toUpperCase() + currentClass.track.slice(1)} Track
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Subjects Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            <TabsTrigger value="compulsory">
              Core Subjects ({filteredCompulsorySubjects.length})
            </TabsTrigger>
            <TabsTrigger value="elective">
              Electives ({filteredElectiveSubjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredCompulsorySubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Core Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Required for all students in {classDisplay}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompulsorySubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      progress={mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress] || {
                        totalTopics: 10,
                        completedTopics: 0,
                        currentWeek: 1,
                        totalWeeks: 12,
                        upcomingAssessments: 0,
                        termProgress: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredElectiveSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Elective Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Optional subjects you can choose
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredElectiveSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      progress={mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress] || {
                        totalTopics: 8,
                        completedTopics: 0,
                        currentWeek: 1,
                        totalWeeks: 10,
                        upcomingAssessments: 0,
                        termProgress: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredCompulsorySubjects.length === 0 && filteredElectiveSubjects.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Subjects Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "No subjects match your search." : "No subjects available for this class."}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compulsory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompulsorySubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  progress={mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress] || {
                    totalTopics: 10,
                    completedTopics: 0,
                    currentWeek: 1,
                    totalWeeks: 12,
                    upcomingAssessments: 0,
                    termProgress: 0,
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="elective" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredElectiveSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  progress={mockSubjectProgress[subject.id as keyof typeof mockSubjectProgress] || {
                    totalTopics: 8,
                    completedTopics: 0,
                    currentWeek: 1,
                    totalWeeks: 10,
                    upcomingAssessments: 0,
                    termProgress: 0,
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}