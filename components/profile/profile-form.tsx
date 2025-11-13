"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { format, parse } from "date-fns";

import { useAcademicContext } from '@/components/providers/academic-context';
import { getClassLevelById, normalizeClassString } from '@/config/education';

import {
  getProfile,
  getProfileData,
  ProfileEditData,
  updateProfile,
  UserProfile,
  validateProfileData,
} from "@/lib/api/profile";
import { ProfilePageData } from "@/lib/types/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Form validation schema
const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    role: z.enum(["student", "guardian"]).or(z.literal("")).optional(),
    school: z.string().optional(),
    class: z.string().optional(),
    discipline: z.string().optional(),
    date_of_birth: z.date().optional(),
    gender: z.enum(["male", "female"]).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    child_email: z.string().email().optional().or(z.literal("")),
    child_phone: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Require discipline for classes starting with SS or SSS
      if (data.class && (data.class.startsWith("SS") || data.class.startsWith("SSS")) && !data.discipline) {
        return false;
      }
      return true;
    },
    {
      message: "Discipline is required for senior secondary classes",
      path: ["discipline"],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSuccess?: (updatedProfile: UserProfile) => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { user, updateUserProfile } = useAuthStore();
  const { setCurrentClass } = useAcademicContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metadata, setMetadata] = useState<ProfilePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showClassChangeWarning, setShowClassChangeWarning] = useState(false);
  const [pendingClassChange, setPendingClassChange] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: "student",
    },
  });

  const selectedRole = watch("role");
  const selectedClass = watch("class");
  
  // Derive primary role from profile for conditional rendering
  const primaryRole = profile 
    ? (Array.isArray(profile.role) ? profile.role[0] : profile.role)
    : null;

  // Load profile data and metadata
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profileData, metadataData] = await Promise.all([
          getProfile(),
          getProfileData(),
        ]);
        setProfile(profileData);
        setMetadata(metadataData);

        // Derive primary role from array
        const primaryRole = Array.isArray(profileData.role) 
          ? profileData.role[0] 
          : profileData.role;
        
        // For guest users, set role to empty string to enable selection
        // For student/guardian, set role accordingly
        // For other roles (teacher/admin/superadmin), don't set form role
        const formRole = primaryRole === "guest" 
          ? "" 
          : (primaryRole === "student" || primaryRole === "guardian" 
              ? primaryRole 
              : "");

        // Populate form with profile data
        const genderValue: "male" | "female" | undefined = 
          profileData.gender === "male" ? "male" : 
          profileData.gender === "female" ? "female" : 
          undefined;
        
        reset({
          name: profileData.name,
          username: profileData.username || "",
          email: profileData.email,
          phone: profileData.phone || "",
          role: (formRole || "") as "student" | "guardian" | "",
          school: profileData.school || "",
          class: profileData.class || "",
          discipline: profileData.discipline || "",
          date_of_birth: profileData.date_of_birth
            ? parse(profileData.date_of_birth, "dd/MM/yyyy", new Date())
            : undefined,
          gender: genderValue,
          country: profileData.country || "",
          state: profileData.state || "",
          city: profileData.city || "",
          address: profileData.address || "",
          child_email: profileData.child_email || "",
          child_phone: profileData.child_phone || "",
        } as ProfileFormData);
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);

      // Role-first submission: if primaryRole is guest, submit role alone first
      const roleValue = data.role as string;
      if (primaryRole === "guest") {
        // Role is required for guests
        if (!roleValue || roleValue === "") {
          toast.error("Role is required. Please select Student or Guardian.");
          setIsSaving(false);
          return;
        }
        
        // Submit role alone first
        try {
          const roleUpdateResult = await updateProfile({ role: roleValue as "student" | "guardian" });
          
          // Refresh profile to get updated role
          const refreshedProfile = await getProfile();
          setProfile(refreshedProfile);
          
          // Update auth store
          const roles = Array.isArray(roleUpdateResult.role) 
            ? roleUpdateResult.role 
            : [roleUpdateResult.role];
          updateUserProfile({
            name: roleUpdateResult.name,
            email: roleUpdateResult.email,
            phone: roleUpdateResult.phone,
            role: roles,
            username: roleUpdateResult.username || "",
            school: roleUpdateResult.school,
            class: roleUpdateResult.class,
            discipline: roleUpdateResult.discipline,
            date_of_birth: roleUpdateResult.date_of_birth,
            country: roleUpdateResult.country,
            state: roleUpdateResult.state,
            city: roleUpdateResult.city,
            address: roleUpdateResult.address,
            gender: roleUpdateResult.gender,
          } as any);
          
          toast.success("Role updated successfully. You can now update other fields.");
        } catch (error: any) {
          toast.error(error.message || "Failed to update role");
          setIsSaving(false);
          return;
        }
      }

      // Prepare data for submission - exclude email and role (already submitted if guest)
      const submitData: any = {
        name: data.name,
        phone: data.phone,
        username: data.username,
        school: data.school,
        class: data.class,
        discipline: data.discipline,
        date_of_birth: data.date_of_birth
          ? format(data.date_of_birth, "dd/MM/yyyy")
          : undefined,
        gender: data.gender,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        child_email: data.child_email,
        child_phone: data.child_phone,
      };
      
      // Only include role if it changed (and user is not guest)
      if (primaryRole !== "guest" && roleValue && roleValue !== primaryRole) {
        submitData.role = roleValue as "student" | "guardian";
      }

      // Validate guardian-specific fields if role is guardian (either selected or existing)
      const effectiveRole = roleValue || primaryRole;
      if (effectiveRole === "guardian") {
        if (!data.child_email || !data.child_phone) {
          toast.error("Child email and phone are required for guardians");
          return;
        }
      }

      // Validate data
      const validationErrors = validateProfileData(submitData as ProfileEditData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }

      // Update profile
      const updatedProfile = await updateProfile(submitData as ProfileEditData);

      // Normalize role to array before updating auth store
      const roles = Array.isArray(updatedProfile.role) 
        ? updatedProfile.role 
        : [updatedProfile.role];

      // Update auth store with full profile data
      updateUserProfile({
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        role: roles,
        username: updatedProfile.username || "",
        school: updatedProfile.school,
        class: updatedProfile.class,
        discipline: updatedProfile.discipline,
        date_of_birth: updatedProfile.date_of_birth,
        country: updatedProfile.country,
        state: updatedProfile.state,
        city: updatedProfile.city,
        address: updatedProfile.address,
        gender: updatedProfile.gender,
      } as any);

      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
      onSuccess?.(updatedProfile);

      // Update academic context if class changed
      if (data.class && data.class !== profile?.class) {
        const normalizedClass = normalizeClassString(data.class);
        const classLevel = normalizedClass 
          ? getClassLevelById(normalizedClass.toLowerCase().replace(' ', ''))
          : null;
        if (classLevel) {
          setCurrentClass(classLevel);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 animate-spin" />
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
          <User className="size-5" />
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
              <UserCheck className="size-4" />
              Basic Information
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                  disabled={primaryRole === "guest"}
                />
                {primaryRole === "guest" && (
                  <p className="text-xs text-muted-foreground">
                    Please select a role first to unlock other fields.
                  </p>
                )}
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  disabled={primaryRole === "guest" || Boolean(profile?.username && typeof profile.username === 'string' && profile.username.trim() !== "")}
                />
                {Boolean(profile?.username && typeof profile.username === 'string' && profile.username.trim() !== "") && (
                  <p className="text-xs text-muted-foreground">
                    Username cannot be changed once set.
                  </p>
                )}
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {primaryRole === "guest" || primaryRole === "student" || primaryRole === "guardian" ? (
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select
                    value={selectedRole || undefined}
                    onValueChange={async (value) => {
                      setValue("role", value as "student" | "guardian");
                      
                      // If role changed and user is guest, submit role immediately
                      if (primaryRole === "guest") {
                        try {
                          setIsSaving(true);
                          const updatedProfile = await updateProfile({ role: value as "student" | "guardian" });
                          
                          // Refresh profile
                          const refreshedProfile = await getProfile();
                          setProfile(refreshedProfile);
                          
                          // Update auth store
                          const roles = Array.isArray(updatedProfile.role) 
                            ? updatedProfile.role 
                            : [updatedProfile.role];
                          updateUserProfile({
                            name: updatedProfile.name,
                            email: updatedProfile.email,
                            phone: updatedProfile.phone,
                            role: roles,
                            username: updatedProfile.username || "",
                            school: updatedProfile.school,
                            class: updatedProfile.class,
                            discipline: updatedProfile.discipline,
                            date_of_birth: updatedProfile.date_of_birth,
                            country: updatedProfile.country,
                            state: updatedProfile.state,
                            city: updatedProfile.city,
                            address: updatedProfile.address,
                            gender: updatedProfile.gender,
                          } as any);
                          
                          toast.success("Role updated successfully. You can now update other fields.");
                        } catch (error: any) {
                          toast.error(error.message || "Failed to update role");
                          // Reset role selection on error
                          setValue("role", "");
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    disabled={primaryRole !== "guest"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                  {primaryRole !== "guest" && (
                    <p className="text-xs text-muted-foreground">
                      Role cannot be changed once set.
                    </p>
                  )}
                  {errors.role && (
                    <p className="text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="size-4" />
              Contact Information
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your.email@example.com"
                    disabled
                    readOnly
                  />
                  {profile?.email_verified_at && (
                    <CheckCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Please contact support if you need to update your email.
                </p>
                {!profile?.email_verified_at && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="size-3" />
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
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                    disabled={primaryRole === "guest"}
                  />
                  {profile?.phone_verified_at && (
                    <CheckCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
                {!profile?.phone_verified_at && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="size-3" />
                    Phone not verified
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Information */}
          {(selectedRole === "student" || primaryRole === "student") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="size-4" />
                Student Information
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    {...register("school")}
                    placeholder="Enter your school name"
                    disabled={primaryRole === "guest"}
                  />
                  {errors.school && (
                    <p className="text-sm text-red-600">{errors.school.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={selectedClass}
                    onValueChange={(value) => {
                      if (profile?.class && profile.class.trim() !== "" && profile.class !== value) {
                        setPendingClassChange(value);
                        setShowClassChangeWarning(true);
                      } else {
                        setValue("class", value);
                      }
                    }}
                    disabled={primaryRole === "guest"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadata?.classes.map((cls) => (
                        <SelectItem key={cls.name} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.class && (
                    <p className="text-sm text-red-600">{errors.class.message}</p>
                  )}
                </div>

                {(selectedClass?.startsWith("SS") || selectedClass?.startsWith("SSS")) && (
                  <div className="space-y-2">
                    <Label htmlFor="discipline">Discipline</Label>
                    <Select
                      value={watch("discipline")}
                      onValueChange={(value) => setValue("discipline", value)}
                      disabled={primaryRole === "guest" || Boolean(profile?.discipline && typeof profile.discipline === 'string' && profile.discipline.trim() !== "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your discipline" />
                      </SelectTrigger>
                      <SelectContent>
                        {metadata?.discipline && metadata.discipline.length > 0 ? (
                          metadata.discipline.map((disc) => (
                            <SelectItem key={disc.name} value={disc.name}>
                              {disc.name}
                            </SelectItem>
                          ))
                        ) : (
                          // Fallback to hardcoded list if metadata unavailable
                          <>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {Boolean(profile?.discipline && typeof profile.discipline === 'string' && profile.discipline.trim() !== "") && (
                      <p className="text-xs text-muted-foreground">
                        Discipline cannot be changed once set.
                      </p>
                    )}
                    {errors.discipline && (
                      <p className="text-sm text-red-600">{errors.discipline.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="size-4" />
              Location
            </div>

              <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="Enter your country"
                  disabled={primaryRole === "guest"}
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="Enter your state"
                  disabled={primaryRole === "guest"}
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Enter your city"
                  disabled={primaryRole === "guest"}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Enter your address"
                  disabled={primaryRole === "guest"}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="size-4" />
              Personal Information
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <DatePicker
                  selected={watch("date_of_birth")}
                  onSelect={(date) => {
                    if (!Boolean(profile?.date_of_birth && typeof profile.date_of_birth === 'string' && profile.date_of_birth.trim() !== "")) {
                      setValue("date_of_birth", date);
                    }
                  }}
                  placeholder="Select your date of birth"
                  disabled={primaryRole === "guest" || Boolean(profile?.date_of_birth && typeof profile.date_of_birth === 'string' && profile.date_of_birth.trim() !== "")}
                />
                {Boolean(profile?.date_of_birth && typeof profile.date_of_birth === 'string' && profile.date_of_birth.trim() !== "") && (
                  <p className="text-xs text-muted-foreground">
                    Date of birth cannot be changed once set.
                  </p>
                )}
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600">{errors.date_of_birth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={watch("gender")}
                  onValueChange={(value) => {
                    if (value === "male" || value === "female") {
                      setValue("gender", value);
                    }
                  }}
                  disabled={primaryRole === "guest" || Boolean(profile?.gender && typeof profile.gender === 'string' && profile.gender.trim() !== "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {Boolean(profile?.gender && typeof profile.gender === 'string' && profile.gender.trim() !== "") && (
                  <p className="text-xs text-muted-foreground">
                    Gender cannot be changed once set.
                  </p>
                )}
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guardian-specific fields */}
          {(selectedRole === "guardian" || primaryRole === "guardian") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="size-4" />
                Child Information
                <Badge variant="secondary" className="ml-auto">
                  Guardian Required
                </Badge>
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  As a guardian, you need to provide your child&apos;s contact
                  information for account management and communication purposes.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="child_email">Child&apos;s Email</Label>
                  <Input
                    id="child_email"
                    type="email"
                    {...register("child_email")}
                    placeholder="child@example.com"
                    disabled={primaryRole === "guest"}
                  />
                  {errors.child_email && (
                    <p className="text-sm text-red-600">
                      {errors.child_email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="child_phone">Child&apos;s Phone</Label>
                  <Input
                    id="child_phone"
                    type="tel"
                    {...register("child_phone")}
                    placeholder="+1 (555) 987-6543"
                    disabled={primaryRole === "guest"}
                  />
                  {errors.child_phone && (
                    <p className="text-sm text-red-600">
                      {errors.child_phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="size-4" />
              Account Status
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-sm">Email Verification</span>
                </div>
                <Badge
                  variant={profile?.email_verified_at ? "default" : "secondary"}
                >
                  {profile?.email_verified_at ? "Verified" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-sm">Phone Verification</span>
                </div>
                <Badge
                  variant={profile?.phone_verified_at ? "default" : "secondary"}
                >
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
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Update Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={showClassChangeWarning} onOpenChange={setShowClassChangeWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Class Change</DialogTitle>
            <DialogDescription>
              Changing your class will reset your subject selections. You will need to re-select your subjects for the new class. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassChangeWarning(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (pendingClassChange) {
                setValue("class", pendingClassChange);
                setPendingClassChange(null);
              }
              setShowClassChangeWarning(false);
            }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
