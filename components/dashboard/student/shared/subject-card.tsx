"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock, Trophy, BookOpen, Target, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Subject } from "@/config/education";
import * as Icons from "lucide-react";

interface SubjectProgress {
  totalTopics: number;
  completedTopics: number;
  currentWeek: number;
  totalWeeks: number;
  upcomingAssessments: number;
  lastAccessed?: string;
  termProgress: number; // Percentage progress for current term
  grade?: string; // Current grade in subject
  caScore?: number; // Continuous Assessment score
}

interface SubjectCardProps {
  subject: Subject;
  progress: SubjectProgress;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const getSubjectIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName] || BookOpen;
  return IconComponent;
};

const gradeColors: Record<string, string> = {
  'A1': 'bg-green-100 text-green-800',
  'B2': 'bg-green-100 text-green-700', 
  'B3': 'bg-yellow-100 text-yellow-800',
  'C4': 'bg-orange-100 text-orange-800',
  'C5': 'bg-orange-100 text-orange-800',
  'C6': 'bg-orange-100 text-orange-800',
  'D7': 'bg-red-100 text-red-700',
  'E8': 'bg-red-100 text-red-700',
  'F9': 'bg-red-100 text-red-800',
};

export function SubjectCard({ 
  subject, 
  progress, 
  className = "",
  variant = 'default' 
}: SubjectCardProps) {
  const IconComponent = getSubjectIcon(subject.icon);
  
  if (variant === 'compact') {
    return (
      <Card className={`hover:shadow-md transition-all duration-300 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${subject.color}20` }}
            >
              <IconComponent className="size-4" style={{ color: subject.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{subject.name}</span>
                {subject.compulsory && (
                  <Badge variant="outline" className="text-xs">Core</Badge>
                )}
                {progress.grade && (
                  <Badge className={`text-xs ${gradeColors[progress.grade] || 'bg-gray-100 text-gray-800'}`}>
                    {progress.grade}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Week {progress.currentWeek}/{progress.totalWeeks} • {progress.termProgress}% complete
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={className}
      >
        <Card className="h-full border-l-4 hover:shadow-lg transition-all duration-300" 
              style={{ borderLeftColor: subject.color }}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <IconComponent className="size-6" style={{ color: subject.color }} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {subject.name}
                    <span className="text-xs text-muted-foreground">({subject.code})</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {subject.compulsory ? (
                  <Badge variant="default" className="text-xs">
                    Core Subject
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Elective
                  </Badge>
                )}
                {progress.grade && (
                  <Badge className={`text-xs ${gradeColors[progress.grade] || 'bg-gray-100 text-gray-800'}`}>
                    Grade: {progress.grade}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Term Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Term Progress</span>
                <span className="font-medium">{progress.termProgress}%</span>
              </div>
              <Progress value={progress.termProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progress.completedTopics}/{progress.totalTopics} topics completed</span>
                {progress.termProgress >= 90 ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Trophy className="size-3" />
                    Excellent
                  </span>
                ) : (
                  <span>Week {progress.currentWeek}/{progress.totalWeeks}</span>
                )}
              </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">CA Score</span>
                </div>
                <div className="text-lg font-semibold">
                  {progress.caScore ? `${progress.caScore}%` : 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Assessments</span>
                </div>
                <div className="text-lg font-semibold">
                  {progress.upcomingAssessments}
                </div>
              </div>
            </div>

            {progress.lastAccessed && (
              <div className="flex items-center gap-2 text-sm pt-2 border-t">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Last accessed: <span className="font-medium text-foreground">{progress.lastAccessed}</span>
                </span>
              </div>
            )}

            {/* Action Button */}
            <Link href={`/dashboard/subjects/${subject.id}`} className="block pt-2">
              <Button className="w-full group">
                {progress.termProgress > 0 ? "Continue Learning" : "Start Subject"}
                <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Link href={`/dashboard/subjects/${subject.id}`} className="block">
        <Card className="h-full border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer" 
              style={{ borderLeftColor: subject.color }}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <IconComponent className="size-5" style={{ color: subject.color }} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {subject.compulsory ? (
                  <Badge variant="default" className="text-xs">
                    Core
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Elective
                  </Badge>
                )}
                {progress.grade && (
                  <Badge className={`text-xs ${gradeColors[progress.grade] || 'bg-gray-100 text-gray-800'}`}>
                    {progress.grade}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Term Progress</span>
                <span className="font-medium">{progress.termProgress}%</span>
              </div>
              <Progress value={progress.termProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Week {progress.currentWeek} of {progress.totalWeeks}</span>
                <span>{progress.completedTopics}/{progress.totalTopics} topics</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between pt-2 text-sm">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  CA: {progress.caScore ? `${progress.caScore}%` : 'N/A'}
                </span>
              </div>
              {progress.upcomingAssessments > 0 && (
                <Badge variant="outline" className="text-xs">
                  {progress.upcomingAssessments} assessment{progress.upcomingAssessments > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
