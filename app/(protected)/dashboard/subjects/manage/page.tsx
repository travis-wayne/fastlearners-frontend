"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectSetupForm } from "@/components/dashboard/student/SubjectSetupForm";
import { getStudentSubjects } from "@/lib/api/subjects";
import type { SubjectsContent } from "@/lib/types/subjects";
import { useAcademicContext } from "@/components/providers/academic-context";

export default function ManageSubjectsPage() {
  const router = useRouter();
  const { currentClass, currentTerm } = useAcademicContext();
  const [subjectsData, setSubjectsData] = useState<SubjectsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formSubmitHandler, setFormSubmitHandler] = useState<(() => void) | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getStudentSubjects();
        if (response.success && response.content) {
          setSubjectsData(response.content);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmUpdate = () => {
    setShowConfirmDialog(false);
    if (formSubmitHandler) {
      // Call the submit handler
      formSubmitHandler();
      setFormSubmitHandler(null);
    }
    // Redirect will happen after form submission completes via onComplete
  };

  // Prepare initial data for form pre-filling
  const initialFormData = subjectsData
    ? {
        classId: currentClass?.id || "",
        termId: currentTerm?.id || "",
        compulsorySelective:
          subjectsData.compulsory_selective?.[0]?.id || undefined,
        // Use selective items for electives, not subjects
        electiveIds: subjectsData.selective?.map((s) => s.id) || [],
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="size-8 animate-spin rounded-full border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Subjects</h1>
          <p className="text-muted-foreground">
            Update your subject selections. Changes will overwrite your current
            selections.
          </p>
        </div>
      </div>

      {/* Warning Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
              <AlertTriangle className="size-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-800 dark:text-orange-200">
            <p className="mb-2">
              Modifying your subject selections will overwrite your current
              registration.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                Your previous subject selections will be replaced with new ones
              </li>
              <li>
                Progress and data associated with removed subjects may be
                affected
              </li>
              <li>
                You can always come back to modify your selections again
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Setup Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Update Subject Selection</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsData && (
              <SubjectSetupForm
                initialData={initialFormData}
                requireConfirmation={true}
                onRequestConfirmation={(submitHandler) => {
                  setFormSubmitHandler(() => submitHandler);
                  setShowConfirmDialog(true);
                }}
                onComplete={() => {
                  router.push("/dashboard/subjects");
                }}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Subject Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update your subject selections? This will
              overwrite your current registration. This action cannot be undone
              easily.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false);
                setFormSubmitHandler(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              Yes, Update Subjects
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

