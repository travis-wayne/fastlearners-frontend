"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RejectConsentFormProps {
  token: string;
}

export function RejectConsentForm({ token }: RejectConsentFormProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReject = async () => {
    try {
      setStatus("submitting");
      const response = await fetch(`/api/parental-consent/${token}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        toast.success("Consent rejected.");
      } else {
        setStatus("error");
        setErrorMessage(
          data.message ||
            "Failed to reject consent. The link may be expired or invalid.",
        );
        toast.error(data.message || "Failed to reject consent.");
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div className="container flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-md border-border/60 shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 pt-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertCircle className="size-10" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Consent Rejected
            </CardTitle>
            <CardDescription className="text-base">
              Consent rejected. Your child has been notified.
            </CardDescription>
            <div className="mt-6 flex w-full flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Changed your mind?
              </p>
              <Button asChild variant="outline">
                <Link href={`/${token}/accept`}>Accept consent here</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md border-border/60 shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Reject Parental Consent
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You are about to reject consent for your child to participate in
            FastLearners.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          {status === "error" && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="size-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Full Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 focus-visible:ring-destructive"
                  disabled={status === "submitting"}
                />
              </div>
            </div>

            <Button
              onClick={handleReject}
              variant="destructive"
              className="w-full font-semibold shadow-sm"
              disabled={status === "submitting"}
              size="lg"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Consent"
              )}
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              <Link
                href={`/${token}/accept`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Back to Accept
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
