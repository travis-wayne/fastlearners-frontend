"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  UserCheck,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { 
  getProfile, 
  updateProfile, 
  validateProfileData,
  UserProfile, 
  ProfileEditData 
} from '@/lib/api/profile';

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  role: z.enum(['student', 'guest', 'guardian']),
  child_email: z.string().email().optional().or(z.literal('')),
  child_phone: z.string().optional().or(z.literal(''))
}).refine((data) => {
  if (data.role === 'guardian') {
    return data.child_email && data.child_phone;
  }
  return true;
}, {
  message: "Child email and phone are required for guardians",
  path: ["child_email"]
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSuccess?: (updatedProfile: UserProfile) => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: 'student'
    }
  });

  const selectedRole = watch('role');

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
        
        // Populate form with profile data
        reset({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role as 'student' | 'guest' | 'guardian',
          child_email: profileData.child_email || '',
          child_phone: profileData.child_phone || ''
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);

      // Validate data
      const validationErrors = validateProfileData(data as ProfileEditData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }

      // Update profile
      const updatedProfile = await updateProfile(data as ProfileEditData);
      
      // Update auth store
      updateUser({
        ...user!,
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role
      });
      
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      onSuccess?.(updatedProfile);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your personal information and account settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserCheck className="h-4 w-4" />
              Basic Information
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setValue('role', value as 'student' | 'guest' | 'guardian')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Contact Information
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                  />
                  {profile?.email_verified_at && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
                {!profile?.email_verified_at && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Email not verified
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                  {profile?.phone_verified_at && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
                {!profile?.phone_verified_at && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Phone not verified
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guardian-specific fields */}
          {selectedRole === 'guardian' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Child Information
                <Badge variant="secondary" className="ml-auto">Guardian Required</Badge>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  As a guardian, you need to provide your child's contact information 
                  for account management and communication purposes.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="child_email">Child's Email</Label>
                  <Input
                    id="child_email"
                    type="email"
                    {...register('child_email')}
                    placeholder="child@example.com"
                  />
                  {errors.child_email && (
                    <p className="text-sm text-red-600">{errors.child_email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="child_phone">Child's Phone</Label>
                  <Input
                    id="child_phone"
                    type="tel"
                    {...register('child_phone')}
                    placeholder="+1 (555) 987-6543"
                  />
                  {errors.child_phone && (
                    <p className="text-sm text-red-600">{errors.child_phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Account Status
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email Verification</span>
                </div>
                <Badge variant={profile?.email_verified_at ? "default" : "secondary"}>
                  {profile?.email_verified_at ? "Verified" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Phone Verification</span>
                </div>
                <Badge variant={profile?.phone_verified_at ? "default" : "secondary"}>
                  {profile?.phone_verified_at ? "Verified" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
