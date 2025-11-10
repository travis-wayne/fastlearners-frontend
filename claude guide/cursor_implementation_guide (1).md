  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-background border-b">
        <div className="container flex items-center justify-between py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold text-sm truncate">{lesson.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
          >
            <BookOpen className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="container mx-auto py-6">
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-6">
          {/* Left Sidebar - Concepts Navigation */}
          <aside className={`
            ${showLeftSidebar ? 'block' : 'hidden'} lg:block
            fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)]
            w-[280px] bg-background border-r lg:border-r-0
          `}>
            <ScrollArea className="h-full py-4 px-4 lg:px-0">
              <LessonSidebar
                lesson={lesson}
                activeSection={activeSection}
                onSectionClick={handleSectionChange}
                onClose={() => setShowLeftSidebar(false)}
              />
            </ScrollArea>
          </aside>

          {/* Main Content Area */}
          <main className="space-y-6" ref={contentRef}>
            {/* Lesson Header */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {lesson.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        Week {lesson.week}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {lesson.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-medium">{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                  </div>
                )}

                {/* Learning Objectives */}
                {lesson.objectives.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Learning Objectives</h3>
                    <ul className="space-y-1">
                      {lesson.objectives.map((objective, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Introduction */}
            {lesson.content.introduction && (
              <Card className="p-6">
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content.introduction }}
                />
              </Card>
            )}

            {/* Content Sections */}
            {lesson.content.sections.map((section) => (
              <Card 
                key={section.id} 
                id={section.id}
                className={`p-6 scroll-mt-24 transition-all ${
                  activeSection === section.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />

                  {/* Media Content */}
                  {section.media && section.media.length > 0 && (
                    <div className="space-y-4">
                      {section.media.map((media, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border">
                          {media.type === 'image' && (
                            <div>
                              <img 
                                src={media.url} 
                                alt={media.caption || section.title}
                                className="w-full"
                              />
                              {media.caption && (
                                <p className="text-sm text-muted-foreground p-2 bg-muted">
                                  {media.caption}
                                </p>
                              )}
                            </div>
                          )}
                          {media.type === 'video' && (
                            <video controls className="w-full">
                              <source src={media.url} />
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Summary */}
            {lesson.content.summary && (
              <Card className="p-6 bg-primary/5">
                <h2 className="text-2xl font-bold mb-4">Summary</h2>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content.summary }}
                />
              </Card>
            )}

            {/* Key Terms */}
            {lesson.content.keyTerms.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Key Terms</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {lesson.content.keyTerms.map((term, i) => (
                    <div key={i} className="space-y-1">
                      <h3 className="font-semibold">{term.term}</h3>
                      <p className="text-sm text-muted-foreground">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
                <div className="space-y-2">
                  {lesson.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <BookOpen className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-muted-foreground">
                            {resource.description}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Complete Lesson Button */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Ready to complete this lesson?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mark as complete and move to the next lesson
                  </p>
                </div>
                <Button onClick={handleComplete} size="lg">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Complete Lesson
                </Button>
              </div>
            </Card>

            {/* Navigation */}
            <LessonNavigation lessonId={lesson.id} />
          </main>

          {/* Right Sidebar - Table of Contents */}
          <aside className={`
            ${showRightSidebar ? 'block' : 'hidden'} lg:block
            fixed lg:sticky top-16 right-0 z-40 h-[calc(100vh-4rem)]
            w-[280px] bg-background border-l lg:border-l-0
          `}>
            <ScrollArea className="h-full py-4 px-4 lg:px-0">
              <LessonTableOfContents
                sections={lesson.content.sections}
                activeSection={activeSection}
                onSectionClick={handleSectionChange}
                onClose={() => setShowRightSidebar(false)}
              />
            </ScrollArea>
          </aside>
        </div>
      </div>

      {/* Overlay for mobile sidebars */}
      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}
    </div>
  );
}
```

### Step 5.3: Left Sidebar - Concepts Navigation

**File:** `components/dashboard/lessons/LessonSidebar.tsx`

```typescript
'use client';

import { CheckCircle2, Circle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Lesson } from '@/lib/types/lessons';

interface LessonSidebarProps {
  lesson: Lesson;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  onClose?: () => void;
}

export function LessonSidebar({
  lesson,
  activeSection,
  onSectionClick,
  onClose,
}: LessonSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h3 className="font-semibold">Lesson Concepts</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="hidden lg:block">
        <h3 className="font-semibold mb-4">Lesson Concepts</h3>
      </div>

      <div className="space-y-2">
        {lesson.concepts.map((concept, index) => {
          const relatedSection = lesson.content.sections[index];
          const isActive = relatedSection?.id === activeSection;
          const isCompleted = relatedSection && 
            lesson.content.sections.findIndex(s => s.id === relatedSection.id) < 
            lesson.content.sections.findIndex(s => s.id === activeSection);

          return (
            <button
              key={concept.id}
              onClick={() => relatedSection && onSectionClick(relatedSection.id)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all
                ${isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isActive ? (
                    <Circle className="w-5 h-5 text-primary fill-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${
                    isActive ? 'text-primary' : ''
                  }`}>
                    {concept.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {concept.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Info */}
      <Card className="p-4 bg-muted">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{lesson.duration} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Concepts</span>
            <span className="font-medium">{lesson.concepts.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Difficulty</span>
            <span className="font-medium capitalize">{lesson.difficulty}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

### Step 5.4: Right Sidebar - Table of Contents

**File:** `components/dashboard/lessons/LessonTableOfContents.tsx`

```typescript
'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContentSection } from '@/lib/types/lessons';

interface LessonTableOfContentsProps {
  sections: ContentSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  onClose?: () => void;
}

export function LessonTableOfContents({
  sections,
  activeSection,
  onSectionClick,
  onClose,
}: LessonTableOfContentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h3 className="font-semibold">Table of Contents</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="hidden lg:block">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
          On This Page
        </h3>
      </div>

      <nav className="space-y-1">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`
                w-full text-left px-3 py-2 rounded text-sm transition-all
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 text-xs opacity-50">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="line-clamp-2">{section.title}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
```

### Step 5.5: Lesson Navigation (Previous/Next)

**File:** `components/dashboard/lessons/LessonNavigation.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LessonNavigationProps {
  lessonId: string;
}

export function LessonNavigation({ lessonId }: LessonNavigationProps) {
  const router = useRouter();
  const [navigation, setNavigation] = useState<{
    previous: { id: string; title: string } | null;
    next: { id: string; title: string } | null;
  }>({ previous: null, next: null });

  useEffect(() => {
    fetchNavigation();
  }, [lessonId]);

  const fetchNavigation = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/navigation`);
      const data = await response.json();
      setNavigation(data);
    } catch (error) {
      console.error('Failed to fetch navigation:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Previous Lesson */}
      {navigation.previous ? (
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all group"
          onClick={() => router.push(`/dashboard/lessons/${navigation.previous!.id}`)}
        >
          <div className="flex items-center gap-3">
            <ChevronLeft className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Previous Lesson
              </div>
              <div className="font-medium truncate group-hover:text-primary transition-colors">
                {navigation.previous.title}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div />
      )}

      {/* Next Lesson */}
      {navigation.next && (
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all group"
          onClick={() => router.push(`/dashboard/lessons/${navigation.next!.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0 text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Next Lesson
              </div>
              <div className="font-medium truncate group-hover:text-primary transition-colors">
                {navigation.next.title}
              </div>
            </div>
            <ChevronRight className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Card>
      )}
    </div>
  );
}
```

---

## Phase 6: API Integration

### Step 6.1: Subject Registration API

**File:** `app/api/subjects/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { class: classLevel, term, subjects } = body;

    // Validate input
    if (!classLevel || !term || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/subjects/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        class_level: classLevel,
        term,
        subjects,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to register subjects' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Subject registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6.2: Get User Subjects API

**File:** `app/api/subjects/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's registered subjects from backend
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/users/${user.id}/subjects`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // User hasn't registered subjects yet
        return NextResponse.json({
          subjects: [],
          hasRegistered: false,
        });
      }
      
      throw new Error('Failed to fetch subjects');
    }

    const data = await response.json();
    
    return NextResponse.json({
      ...data,
      hasRegistered: true,
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6.3: Get Lessons API

**File:** `app/api/lessons/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subjects = searchParams.get('subjects'); // comma-separated subject IDs
    const status = searchParams.get('status');
    const classLevel = searchParams.get('classLevel');
    const term = searchParams.get('term');

    // Build query parameters
    const params = new URLSearchParams();
    if (subjects) params.append('subjects', subjects);
    if (status) params.append('status', status);
    if (classLevel) params.append('class_level', classLevel);
    if (term) params.append('term', term);

    // Fetch lessons from backend
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/lessons?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6.4: Get Single Lesson API

**File:** `app/api/lessons/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch lesson details from backend
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/lessons/${params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch lesson');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6.5: Lesson Progress API

**File:** `app/api/lessons/[id]/progress/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch lesson progress
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/lessons/${params.id}/progress?user_id=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error('Failed to fetch progress');
    }

    const data = response.ok ? await response.json() : { progress: null };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Update lesson progress
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/lessons/${params.id}/progress`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          ...body,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Phase 7: Testing & Polish

### Step 7.1: Testing Checklist

**Subject Registration Flow:**
- [ ] First-time user sees setup form
- [ ] Class selection updates available subjects
- [ ] Core subjects auto-selected in step 2
- [ ] Cannot deselect core subjects
- [ ] Elective selection respects maximum
- [ ] Review step shows all selections correctly
- [ ] API submission works
- [ ] Redirects to subject dashboard after success
- [ ] Error handling displays properly

**Subject Dashboard:**
- [ ] Displays all registered subjects
- [ ] Shows accurate progress for each subject
- [ ] Stats cards calculate correctly
- [ ] Filters work (All/Core/Electives)
- [ ] Search functionality works
- [ ] Subject cards link to lessons
- [ ] Reregistration dialog opens and works
- [ ] Loading states display properly

**Lessons Dashboard:**
- [ ] Shows lessons for registered subjects only
- [ ] Subject tabs filter lessons correctly
- [ ] Status filters work (All/Not Started/In Progress/Completed)
- [ ] Continue learning section shows recent lessons
- [ ] Stats calculate correctly
- [ ] Lesson cards display all info
- [ ] Links to lesson content work

**Individual Lesson Content:**
- [ ] 3-column layout works on desktop
- [ ] Mobile sidebars toggle correctly
- [ ] Left sidebar (concepts) navigation works
- [ ] Right sidebar (TOC) navigation works
- [ ] Scrolling updates active section
- [ ] Progress tracking works
- [ ] Time spent tracking accurate
- [ ] Media content displays properly
- [ ] Previous/Next navigation works
- [ ] Complete lesson updates status

### Step 7.2: Responsive Design Checks

**Mobile (< 768px):**
- [ ] Sidebars hidden by default
- [ ] Toggle buttons visible in header
- [ ] Sidebars slide in from sides# Nigerian School Subject & Lesson Management System - Complete Implementation Guide

## 🎯 Project Overview

This guide provides a comprehensive, phase-by-phase implementation plan for transforming the existing blog infrastructure in `/dashboard/subjects` and `/dashboard/lessons` into a fully functional Nigerian school subject management and lesson delivery system.

---

## 📋 Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Phase 1: Data Layer Setup](#phase-1-data-layer-setup)
3. [Phase 2: Subject Registration Flow](#phase-2-subject-registration-flow)
4. [Phase 3: Subject Dashboard](#phase-3-subject-dashboard)
5. [Phase 4: Lessons Dashboard](#phase-4-lessons-dashboard)
6. [Phase 5: Individual Lesson Content](#phase-5-individual-lesson-content)
7. [Phase 6: API Integration](#phase-6-api-integration)
8. [Phase 7: Testing & Polish](#phase-7-testing--polish)

---

## Prerequisites & Setup

### Required Dependencies
```bash
# Install if not already present
pnpm install lucide-react sonner recharts date-fns
```

### Folder Structure to Create
```
/data
  └── subjects.ts (Nigerian curriculum data)

/components/dashboard/subjects
  ├── SubjectSetupForm.tsx (Multi-step registration)
  ├── SubjectDashboard.tsx (Main subjects view)
  ├── SubjectCard.tsx (Individual subject card)
  ├── SubjectProgress.tsx (Progress visualization)
  ├── ReregistrationDialog.tsx (Change subjects)
  └── SubjectFilters.tsx (Filter subjects)

/components/dashboard/lessons
  ├── LessonsDashboard.tsx (Lessons overview)
  ├── LessonCard.tsx (Individual lesson card)
  ├── LessonContent.tsx (3-column lesson viewer)
  ├── LessonSidebar.tsx (Concepts navigation)
  ├── LessonTableOfContents.tsx (TOC navigation)
  ├── LessonProgress.tsx (Lesson progress tracking)
  └── LessonNavigation.tsx (Previous/Next)

/app/(protected)/dashboard/subjects
  ├── page.tsx (Subject dashboard or setup)
  ├── layout.tsx (Use blog layout style)
  ├── reregister/page.tsx (Change subjects)
  └── [id]/page.tsx (Individual subject view)

/app/(protected)/dashboard/lessons
  ├── page.tsx (Lessons dashboard)
  ├── layout.tsx (Blog-style layout)
  └── [id]/page.tsx (Individual lesson content)

/app/api/subjects
  ├── register/route.ts
  ├── route.ts (GET user subjects)
  └── reregister/route.ts

/app/api/lessons
  ├── route.ts (GET lessons by subject)
  ├── [id]/route.ts (GET lesson content)
  └── progress/route.ts (Update progress)
```

---

## Phase 1: Data Layer Setup

### Step 1.1: Create Nigerian Curriculum Data File

**File:** `data/subjects.ts`

**What to do:**
1. Create `/data/subjects.ts` with complete Nigerian curriculum data
2. Include JSS (Junior Secondary School) subjects
3. Include SSS (Senior Secondary School) subjects
4. Define subject requirements (core + electives)
5. Add helper functions for subject management

**Key Features:**
- 6 core subjects for JSS, 6 electives (total 12)
- 3 core subjects for SSS, 6 electives (total 9)
- Subject metadata (icons, descriptions, categories)
- Validation functions
- Subject combination recommendations for SSS

**Implementation:**
```typescript
// Structure already provided in artifact: nigerian_subjects_data
// Copy the complete content from the artifact
```

### Step 1.2: Type Definitions

**File:** `lib/types/subjects.ts`

```typescript
export interface UserSubjectRegistration {
  id: string;
  userId: string;
  classLevel: string; // jss1, jss2, jss3, sss1, sss2, sss3
  term: string; // 1, 2, 3
  subjects: string[]; // Array of subject IDs
  registeredAt: string;
  updatedAt: string;
}

export interface SubjectProgress {
  subjectId: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
  averageScore: number;
  timeSpent: number; // in minutes
}

export interface UserSubjectData extends UserSubjectRegistration {
  progress: Record<string, SubjectProgress>;
}
```

**File:** `lib/types/lessons.ts`

```typescript
export interface Lesson {
  id: string;
  title: string;
  subjectId: string;
  classLevel: string;
  term: string;
  week: number;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: LessonConcept[];
  content: LessonContent;
  objectives: string[];
  prerequisites: string[];
  resources: LessonResource[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonConcept {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface LessonContent {
  introduction: string;
  sections: ContentSection[];
  summary: string;
  keyTerms: KeyTerm[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  order: number;
  type: 'text' | 'video' | 'interactive' | 'exercise';
  media?: MediaContent[];
}

export interface MediaContent {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  caption?: string;
  duration?: number;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface LessonResource {
  type: 'pdf' | 'video' | 'link' | 'exercise';
  title: string;
  url: string;
  description?: string;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  timeSpent: number; // minutes
  lastPosition: string; // section ID
  startedAt?: string;
  completedAt?: string;
  score?: number;
}
```

---

## Phase 2: Subject Registration Flow

### Step 2.1: Multi-Step Subject Setup Form

**File:** `components/dashboard/subjects/SubjectSetupForm.tsx`

**What to do:**
1. Create a 4-step wizard for subject registration
2. Step 1: Select class and term
3. Step 2: Auto-select and display core subjects
4. Step 3: Select electives (show core as disabled)
5. Step 4: Review and submit

**Key Features:**
- Progress indicator showing step completion
- Subject count tracker (X/12 for JSS, X/9 for SSS)
- Visual subject cards with icons and descriptions
- Core subject badges
- Validation at each step
- API integration for submission
- Success toast and redirect to dashboard

**Implementation:**
```typescript
// Complete implementation provided in artifact: subject_setup_form
// Copy the entire component code
```

**Styling Guidelines:**
- Use existing blog card styling for consistency
- Implement smooth transitions between steps
- Add hover effects on subject cards
- Use primary color for selected subjects
- Disabled subjects should have reduced opacity
- Progress bar at top showing overall completion

### Step 2.2: First-Time User Detection

**File:** `app/(protected)/dashboard/subjects/page.tsx`

```typescript
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { SubjectSetupForm } from '@/components/dashboard/subjects/SubjectSetupForm';
import { SubjectDashboard } from '@/components/dashboard/subjects/SubjectDashboard';
import { getCurrentUser } from '@/lib/api/auth';

export default async function SubjectsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Check if user has registered subjects
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subjects`, {
    headers: {
      'Authorization': `Bearer ${user.token}`,
    },
    cache: 'no-store',
  });

  const hasSubjects = response.ok && (await response.json()).subjects?.length > 0;

  return (
    <div className="container py-8">
      {hasSubjects ? (
        <Suspense fallback={<SubjectDashboardSkeleton />}>
          <SubjectDashboard />
        </Suspense>
      ) : (
        <SubjectSetupForm />
      )}
    </div>
  );
}
```

### Step 2.3: Layout (Blog-Inspired)

**File:** `app/(protected)/dashboard/subjects/layout.tsx`

```typescript
import { BlogHeaderLayout } from '@/components/content/blog-header-layout';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function SubjectsLayout({
  children,
}: {
  children: React.Node;
}) {
  return (
    <BlogHeaderLayout>
      <MaxWidthWrapper className="py-8">
        {children}
      </MaxWidthWrapper>
    </BlogHeaderLayout>
  );
}
```

---

## Phase 3: Subject Dashboard

### Step 3.1: Main Subject Dashboard Component

**File:** `components/dashboard/subjects/SubjectDashboard.tsx`

**What to do:**
1. Fetch user's registered subjects
2. Display subject cards in a grid
3. Show progress for each subject
4. Add filters (All, Core, Electives)
5. Show quick stats (total subjects, progress, time spent)
6. Add reregistration button

**Key Features:**
- Hero section with class and term info
- Stats cards showing:
  - Total subjects registered
  - Lessons completed
  - Average progress
  - Time spent learning
- Subject grid with progress indicators
- Search and filter functionality
- Quick actions (View lessons, Continue learning)
- Recent activity section
- Achievements/milestones

**Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Trophy, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubjectCard } from './SubjectCard';
import { SubjectFilters } from './SubjectFilters';
import { ReregistrationDialog } from './ReregistrationDialog';
import { getAllSubjects, getClassName, getTermName } from '@/data/subjects';
import type { UserSubjectData, SubjectProgress } from '@/lib/types/subjects';

export function SubjectDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserSubjectData | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'elective'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReregister, setShowReregister] = useState(false);

  useEffect(() => {
    fetchSubjectData();
  }, []);

  const fetchSubjectData = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SubjectDashboardSkeleton />;
  }

  if (!userData) {
    return <div>Failed to load subjects</div>;
  }

  const category = userData.classLevel.startsWith('jss') ? 'jss' : 'sss';
  const allSubjects = getAllSubjects(category);
  const userSubjects = allSubjects.filter(s => 
    userData.subjects.includes(s.id)
  );

  // Filter subjects
  const filteredSubjects = userSubjects.filter(subject => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'core' && subject.isCore) ||
      (filter === 'elective' && !subject.isCore);
    
    const matchesSearch = 
      searchQuery === '' ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalLessons = Object.values(userData.progress).reduce(
    (sum, p) => sum + p.totalLessons, 0
  );
  const completedLessons = Object.values(userData.progress).reduce(
    (sum, p) => sum + p.completedLessons, 0
  );
  const averageProgress = totalLessons > 0 
    ? (completedLessons / totalLessons) * 100 
    : 0;
  const totalTimeSpent = Object.values(userData.progress).reduce(
    (sum, p) => sum + p.timeSpent, 0
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            My Subjects
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {getClassName(userData.classLevel)} • {getTermName(userData.term)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowReregister(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Reregister Subjects
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSubjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {userSubjects.filter(s => s.isCore).length} core, {' '}
              {userSubjects.filter(s => !s.isCore).length} electives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lessons Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedLessons}/{totalLessons}
            </div>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Spent
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total learning time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <SubjectFilters
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Subject Grid */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            All Subjects ({userSubjects.length})
          </TabsTrigger>
          <TabsTrigger value="core">
            Core ({userSubjects.filter(s => s.isCore).length})
          </TabsTrigger>
          <TabsTrigger value="elective">
            Electives ({userSubjects.filter(s => !s.isCore).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredSubjects.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No subjects found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  progress={userData.progress[subject.id]}
                  onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reregistration Dialog */}
      {showReregister && (
        <ReregistrationDialog
          currentData={userData}
          onClose={() => setShowReregister(false)}
          onSuccess={() => {
            setShowReregister(false);
            fetchSubjectData();
          }}
        />
      )}
    </div>
  );
}

function SubjectDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-20 bg-muted rounded-lg animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### Step 3.2: Subject Card Component

**File:** `components/dashboard/subjects/SubjectCard.tsx`

```typescript
'use client';

import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Subject } from '@/data/subjects';
import type { SubjectProgress } from '@/lib/types/subjects';

interface SubjectCardProps {
  subject: Subject;
  progress?: SubjectProgress;
  onClick: () => void;
}

export function SubjectCard({ subject, progress, onClick }: SubjectCardProps) {
  const progressPercent = progress
    ? (progress.completedLessons / progress.totalLessons) * 100
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{subject.icon}</div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              {subject.isCore && (
                <Badge variant="secondary" className="mt-1">
                  Core
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {subject.description}
        </p>

        {progress && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercent} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>
                  {progress.completedLessons}/{progress.totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{progress.timeSpent}m</span>
              </div>
            </div>
          </>
        )}

        <Button className="w-full group-hover:gap-2 transition-all" variant="outline">
          View Lessons
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Step 3.3: Reregistration Dialog

**File:** `components/dashboard/subjects/ReregistrationDialog.tsx`

```typescript
'use client';

import { useState } from 'react';
import { SubjectSetupForm } from './SubjectSetupForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { UserSubjectData } from '@/lib/types/subjects';

interface ReregistrationDialogProps {
  currentData: UserSubjectData;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReregistrationDialog({
  currentData,
  onClose,
  onSuccess,
}: ReregistrationDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reregister Subjects</DialogTitle>
          <DialogDescription>
            Update your subject selection for the current term. Your progress will be preserved.
          </DialogDescription>
        </DialogHeader>
        
        <SubjectSetupForm
          initialData={currentData}
          isReregistration
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

## Phase 4: Lessons Dashboard

### Step 4.1: Lessons Dashboard Component

**File:** `components/dashboard/lessons/LessonsDashboard.tsx`

**What to do:**
1. Display lessons grouped by registered subjects
2. Show lesson progress for each subject
3. Filter by subject, status (not started, in progress, completed)
4. Show recent lessons and continue learning section
5. Display lesson cards with preview

**Key Features:**
- Subject tabs showing registered subjects only
- Lesson status filters
- Progress tracking per lesson
- Quick stats (total lessons, completed, time spent)
- "Continue where you left off" section
- Lesson cards with:
  - Title and description
  - Duration estimate
  - Difficulty level
  - Progress indicator
  - Quick action buttons

**Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Filter, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LessonCard } from './LessonCard';
import { getAllSubjects } from '@/data/subjects';
import type { Lesson, LessonProgress } from '@/lib/types/lessons';
import type { UserSubjectData } from '@/lib/types/subjects';

export function LessonsDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserSubjectData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    fetchData();
  }, [selectedSubject]);

  const fetchData = async () => {
    try {
      // Fetch user subjects
      const subjectsRes = await fetch('/api/subjects');
      const subjectsData = await subjectsRes.json();
      setUserData(subjectsData);

      // Fetch lessons for registered subjects
      const lessonsRes = await fetch(
        `/api/lessons?subjects=${subjectsData.subjects.join(',')}`
      );
      const lessonsData = await lessonsRes.json();
      setLessons(lessonsData.lessons);

      // Fetch lesson progress
      const progressRes = await fetch('/api/lessons/progress');
      const progressData = await progressRes.json();
      setLessonProgress(progressData.progress);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LessonsDashboardSkeleton />;
  }

  if (!userData) {
    return <div>Failed to load data</div>;
  }

  const category = userData.classLevel.startsWith('jss') ? 'jss' : 'sss';
  const allSubjects = getAllSubjects(category);
  const userSubjects = allSubjects.filter(s => userData.subjects.includes(s.id));

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSubject = selectedSubject === 'all' || lesson.subjectId === selectedSubject;
    const progress = lessonProgress[lesson.id];
    const matchesStatus = 
      statusFilter === 'all' ||
      (progress?.status === statusFilter) ||
      (!progress && statusFilter === 'not-started');
    
    return matchesSubject && matchesStatus;
  });

  // Calculate stats
  const totalLessons = lessons.length;
  const completedCount = Object.values(lessonProgress).filter(
    p => p.status === 'completed'
  ).length;
  const inProgressCount = Object.values(lessonProgress).filter(
    p => p.status === 'in-progress'
  ).length;

  // Get recent lessons (last accessed)
  const recentLessons = lessons
    .filter(l => lessonProgress[l.id]?.status === 'in-progress')
    .sort((a, b) => {
      const aTime = lessonProgress[a.id]?.startedAt || '';
      const bTime = lessonProgress[b.id]?.startedAt || '';
      return bTime.localeCompare(aTime);
    })
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">My Lessons</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Continue your learning journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Across {userSubjects.length} subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              Keep learning!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Play className="h-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {((completedCount / totalLessons) * 100).toFixed(1)}% done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      {recentLessons.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recentLessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress[lesson.id]}
                subject={userSubjects.find(s => s.id === lesson.subjectId)}
                onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {userSubjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.icon} {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lessons by Subject */}
      <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
        <TabsList>
          <TabsTrigger value="all">All Lessons</TabsTrigger>
          {userSubjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.icon} {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedSubject} className="mt-6">
          {filteredLessons.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress[lesson.id]}
                  subject={userSubjects.find(s => s.id === lesson.subjectId)}
                  onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LessonsDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-20 bg-muted rounded-lg animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### Step 4.2: Lesson Card Component

**File:** `components/dashboard/lessons/LessonCard.tsx`

```typescript
'use client';

import { Clock, BookOpen, TrendingUp, CheckCircle2, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Lesson, LessonProgress } from '@/lib/types/lessons';
import type { Subject } from '@/data/subjects';

interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
  subject?: Subject;
  onClick: () => void;
  compact?: boolean;
}

export function LessonCard({ lesson, progress, subject, onClick, compact }: LessonCardProps) {
  const statusConfig = {
    'not-started': { color: 'bg-gray-500', label: 'Not Started', icon: BookOpen },
    'in-progress': { color: 'bg-blue-500', label: 'In Progress', icon: PlayCircle },
    'completed': { color: 'bg-green-500', label: 'Completed', icon: CheckCircle2 },
  };

  const status = progress?.status || 'not-started';
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {lesson.title}
            </h3>
            <StatusIcon className={`w-5 h-5 ${status === 'completed' ? 'text-green-600' : 'text-muted-foreground'} flex-shrink-0`} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {subject && (
              <Badge variant="outline" className="text-xs">
                {subject.icon} {subject.name}
              </Badge>
            )}
            <Badge variant="secondary" className={`text-xs ${difficultyColors[lesson.difficulty]}`}>
              {lesson.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Week {lesson.week}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && (
          <>
            {/* Objectives Preview */}
            {lesson.objectives.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Learning Objectives:</p>
                <ul className="text-sm space-y-1">
                  {lesson.objectives.slice(0, 2).map((obj, i) => (
                    <li key={i} className="text-muted-foreground line-clamp-1">
                      • {obj}
                    </li>
                  ))}
                  {lesson.objectives.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{lesson.objectives.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Progress */}
        {progress && progress.status !== 'not-started' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lesson.concepts.length} concepts</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full group-hover:gap-2 transition-all" 
          variant={status === 'completed' ? 'outline' : 'default'}
        >
          {status === 'not-started' && 'Start Lesson'}
          {status === 'in-progress' && 'Continue'}
          {status === 'completed' && 'Review'}
        </Button>

        {progress && progress.timeSpent > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            {progress.timeSpent} minutes spent
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Phase 5: Individual Lesson Content (3-Column Layout)

### Step 5.1: Lesson Content Page Component

**File:** `app/(protected)/dashboard/lessons/[id]/page.tsx`

```typescript
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { LessonContent } from '@/components/dashboard/lessons/LessonContent';
import { getCurrentUser } from '@/lib/api/auth';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch lesson data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params.id}`,
    {
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    notFound();
  }

  const lesson = await response.json();

  return (
    <Suspense fallback={<LessonContentSkeleton />}>
      <LessonContent lesson={lesson} />
    </Suspense>
  );
}

function LessonContentSkeleton() {
  return (
    <div className="grid lg:grid-cols-[250px_1fr_250px] gap-6">
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-64 bg-muted rounded animate-pulse" />
        <div className="h-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### Step 5.2: Main Lesson Content Component (3-Column Layout)

**File:** `components/dashboard/lessons/LessonContent.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LessonSidebar } from './LessonSidebar';
import { LessonTableOfContents } from './LessonTableOfContents';
import { LessonNavigation } from './LessonNavigation';
import type { Lesson, LessonProgress } from '@/lib/types/lessons';

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [activeSection, setActiveSection] = useState<string>(lesson.content.sections[0]?.id || '');
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchProgress();
    trackTimeSpent();

    return () => {
      updateProgress();
    };
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/progress`);
      const data = await response.json();
      setProgress(data.progress);
      
      if (data.progress?.lastPosition) {
        setActiveSection(data.progress.lastPosition);
        scrollToSection(data.progress.lastPosition);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const trackTimeSpent = () => {
    const interval = setInterval(() => {
      updateProgress();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  };

  const updateProgress = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 60000);
    const currentProgress = calculateProgress();

    try {
      await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: currentProgress,
          lastPosition: activeSection,
          timeSpent,
          status: currentProgress === 100 ? 'completed' : 'in-progress',
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const calculateProgress = () => {
    // Calculate based on sections viewed
    const totalSections = lesson.content.sections.length;
    const sectionIndex = lesson.content.sections.findIndex(s => s.id === activeSection);
    return Math.floor(((sectionIndex + 1) / totalSections) * 100);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  const handleComplete = async () => {
    await fetch(`/api/lessons/${lesson.id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progress: 100,
        status: 'completed',
        completedAt: new Date().toISOString(),
      }),
    });

    router.push('/dashboard/lessons');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile