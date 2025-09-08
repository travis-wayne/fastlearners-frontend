"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Shield, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface EmailVerificationGateProps {
  onVerified: () => void;
  children: React.ReactNode;
  requireVerification?: boolean;
  title?: string;
  description?: string;
}

export function EmailVerificationGate({
  onVerified,
  children,
  requireVerification = true,
  title = "Email Verification Required",
  description = "For security purposes, please verify your email address before changing your password."
}: EmailVerificationGateProps) {
  const { user } = useAuthStore();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [step, setStep] = useState<'check' | 'send' | 'verify'>('check');

  useEffect(() => {
    // Check if email verification is required
    if (!requireVerification) {
      setIsVerified(true);
      onVerified();
      return;
    }

    // Check if user email is already verified
    if (user?.email_verified_at) {
      setIsVerified(true);
      onVerified();
    } else {
      setStep('send');
    }
  }, [user, requireVerification, onVerified]);

  useEffect(() => {
    // Countdown timer for resend cooldown
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleSendVerificationCode = async () => {
    try {
      setIsSendingCode(true);
      
      // In a real app, you would call an API to send verification code
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Verification code sent to your email address');
      setStep('verify');
      setCooldownTime(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real app, you would call an API to verify the code
      // For now, we'll simulate it (accept any 6-digit code)
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsVerified(true);
        onVerified();
        toast.success('Email verified successfully');
      } else {
        throw new Error('Invalid verification code. Please enter a 6-digit code.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldownTime > 0) return;
    await handleSendVerificationCode();
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
              <Shield className="size-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User email info */}
          <div className="flex items-center justify-between rounded-lg border bg-white p-3">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="font-medium">{user?.email}</span>
            </div>
            <Badge variant={user?.email_verified_at ? "default" : "secondary"}>
              {user?.email_verified_at ? (
                <>
                  <Check className="mr-1 size-3" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 size-3" />
                  Unverified
                </>
              )}
            </Badge>
          </div>

          {step === 'send' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  We need to verify your email address before you can change your password. 
                  Click the button below to receive a verification code.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSendVerificationCode}
                disabled={isSendingCode}
                className="w-full"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <Alert>
                <Mail className="size-4" />
                <AlertDescription>
                  We&apos;ve sent a 6-digit verification code to <strong>{user?.email}</strong>.
                  Please check your email and enter the code below.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center font-mono text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button 
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 size-4" />
                      Verify Email
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendCode}
                    disabled={cooldownTime > 0 || isSendingCode}
                    className="text-muted-foreground"
                  >
                    {cooldownTime > 0 ? (
                      <>
                        <Clock className="mr-1 size-3" />
                        Resend in {cooldownTime}s
                      </>
                    ) : (
                      'Did not receive the code? Resend'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show locked content as preview */}
      <div className="relative">
        <div className="pointer-events-none opacity-50 blur-sm">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="border-2 border-dashed bg-white/95">
            <CardContent className="p-4 text-center">
              <Shield className="mx-auto mb-2 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Complete email verification to access
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
