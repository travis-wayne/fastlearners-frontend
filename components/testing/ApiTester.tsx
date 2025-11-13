'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play, 
  Database,
  User,
  UserCheck,
  Users,
  AlertTriangle 
} from 'lucide-react';
import {
  getStudentDashboard,
  getGuardianDashboard,
  getGuestDashboard,
  getStudentSubjects,
  updateCompulsorySelectiveSubject,
  updateSelectiveSubjects,
  getErrorMessage,
} from '@/lib/api/lessons-api';
import {
  getSubjectsWithSlugs,
  getTopicsBySubjectSlug,
  getLessonContentBySlug,
} from '@/lib/api/lessons';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: any;
  error?: string;
  duration?: number;
}

export function ApiTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  const updateResult = (endpoint: string, result: Partial<TestResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.endpoint === endpoint);
      if (existing) {
        return prev.map(r => r.endpoint === endpoint ? { ...r, ...result } : r);
      } else {
        return [...prev, { endpoint, method: 'GET', status: 'idle', ...result }];
      }
    });
  };

  const testEndpoint = async (
    endpoint: string, 
    testFunction: () => Promise<any>,
    method: string = 'GET'
  ) => {
    const startTime = Date.now();
    
    updateResult(endpoint, { 
      status: 'loading', 
      method,
      message: 'Testing...',
      error: undefined,
      data: undefined
    });

    try {
      const response = await testFunction();
      const duration = Date.now() - startTime;
      
      updateResult(endpoint, {
        status: 'success',
        message: `Success (${duration}ms)`,
        data: response,
        duration
      });
      
      return { success: true, response };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = getErrorMessage(error);
      
      updateResult(endpoint, {
        status: 'error',
        message: `Failed (${duration}ms)`,
        error: errorMessage,
        duration
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Individual test functions
  const testGetSubjectsWithSlugs = () =>
    testEndpoint('Get Subjects With Slugs', getSubjectsWithSlugs, 'GET');

  const testGetTopicsBySubjectSlug = () =>
    testEndpoint('Get Topics By Subject Slug', () => {
      // Use a test subject slug - adjust based on your test data
      return getTopicsBySubjectSlug('mathematics');
    }, 'GET');

  const testGetLessonContentBySlug = () =>
    testEndpoint('Get Lesson Content By Slug', () => {
      // Use test slugs - adjust based on your test data
      return getLessonContentBySlug('mathematics', 'algebra');
    }, 'GET');

  const testStudentDashboard = () =>
    testEndpoint('Student Dashboard', getStudentDashboard, 'GET');

  const testGuardianDashboard = () =>
    testEndpoint('Guardian Dashboard', getGuardianDashboard, 'GET');

  const testGuestDashboard = () =>
    testEndpoint('Guest Dashboard', getGuestDashboard, 'GET');

  const testStudentSubjects = () =>
    testEndpoint('Student Subjects', getStudentSubjects, 'GET');

  const testUpdateCompulsorySubject = () =>
    testEndpoint('Update Compulsory Subject', () => 
      updateCompulsorySelectiveSubject(22), 'POST');

  const testUpdateSelectiveSubjects = () =>
    testEndpoint('Update Selective Subjects', () => 
      updateSelectiveSubjects([31, 7, 8, 36]), 'POST');

  // Test all endpoints
  const testAllEndpoints = async () => {
    setIsTestingAll(true);
    setResults([]);

    const tests = [
      testGetSubjectsWithSlugs,
      testGetTopicsBySubjectSlug,
      testGetLessonContentBySlug,
      testStudentDashboard,
      testGuardianDashboard,
      testGuestDashboard,
      testStudentSubjects,
      // Skip update tests in batch to avoid side effects
      // testUpdateCompulsorySubject,
      // testUpdateSelectiveSubjects,
    ];

    for (const test of tests) {
      await test();
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsTestingAll(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="size-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'error':
        return <XCircle className="size-4 text-red-500" />;
      default:
        return <div className="size-4" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="size-5" />
            Fast Learners API Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
                This tool tests API connectivity. Make sure you have a valid authentication token.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4">
              <Button
                onClick={testAllEndpoints}
                disabled={isTestingAll}
                className="flex items-center gap-2"
              >
                {isTestingAll ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                Test All Endpoints
              </Button>
              
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>

              {totalCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge className={getStatusColor('success')}>
                    ✓ {successCount}
                  </Badge>
                  <Badge className={getStatusColor('error')}>
                    ✗ {errorCount}
                  </Badge>
                  <span className="text-muted-foreground">
                    of {totalCount} tests
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Test Controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="size-4" />
              Lessons Management (Slug-based)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testGetSubjectsWithSlugs}
                className="w-full justify-start"
              >
                Test Get Subjects With Slugs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testGetTopicsBySubjectSlug}
                className="w-full justify-start"
              >
                Test Get Topics By Subject Slug
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testGetLessonContentBySlug}
                className="w-full justify-start"
              >
                Test Get Lesson Content By Slug
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-4" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testStudentDashboard}
                className="w-full justify-start"
              >
                <User className="mr-2 size-3" />
                Test Student Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testGuardianDashboard}
                className="w-full justify-start"
              >
                <UserCheck className="mr-2 size-3" />
                Test Guardian Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testGuestDashboard}
                className="w-full justify-start"
              >
                <User className="mr-2 size-3" />
                Test Guest Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testStudentSubjects}
                className="w-full justify-start"
              >
                Test Student Subjects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={result.endpoint} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.endpoint}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.method}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {result.message}
                    </span>
                  </div>

                  {result.error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs">
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.data && (
                    <div className="rounded border bg-muted p-3">
                      <details>
                        <summary className="cursor-pointer text-xs font-medium">
                          Response Data
                        </summary>
                        <pre className="mt-2 overflow-auto text-xs">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {index < results.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">⚠️ Destructive Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertDescription>
                These tests modify data. Use with caution!
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={testUpdateCompulsorySubject}
              >
                Test Update Compulsory Subject
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={testUpdateSelectiveSubjects}
              >
                Test Update Selective Subjects
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}