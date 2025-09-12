"use client";

import { useState, useTransition } from "react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { profileApi } from "@/lib/api/auth";
import { User as AuthUser, UserRole as AuthUserRole } from "@/lib/types/auth";
import { userRoleSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserRoleFormProps {
  user: Pick<AuthUser, "id" | "role">;
}

type FormData = {
  role: UserRole;
};

export function UserRoleForm({ user }: UserRoleFormProps) {
  const { updateUserProfile } = useAuthStore();
  const [updated, setUpdated] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Get available roles based on current user's permissions and RBAC rules
  const getAvailableRoles = (): UserRole[] => {
    const currentRole = user.role[0] as AuthUserRole;

    // Guest users can only choose student or guardian (onboarding choice)
    if (currentRole === "guest") {
      return [UserRole.GUEST, UserRole.STUDENT, UserRole.GUARDIAN];
    }

    // For development/testing - show current role only for permanent roles
    // In production, remove the role selector entirely for non-guest users
    // Map auth role string to enum values
    const roleMapping: Record<AuthUserRole, UserRole[]> = {
      guest: [UserRole.GUEST],
      student: [UserRole.STUDENT],
      guardian: [UserRole.GUARDIAN],
      teacher: [UserRole.TEACHER],
      admin: [UserRole.ADMIN],
      superadmin: [UserRole.SUPERADMIN],
    };

    return roleMapping[currentRole] || [UserRole.GUEST];
  };

  const roles = getAvailableRoles();
  // Map auth role to enum for initial state
  const mapAuthRoleToEnum = (authRole: string): UserRole => {
    switch (authRole) {
      case "guest":
        return UserRole.GUEST;
      case "student":
        return UserRole.STUDENT;
      case "guardian":
        return UserRole.GUARDIAN;
      case "teacher":
        return UserRole.TEACHER;
      case "admin":
        return UserRole.ADMIN;
      case "superadmin":
        return UserRole.SUPERADMIN;
      default:
        return UserRole.GUEST;
    }
  };
  const [role, setRole] = useState(mapAuthRoleToEnum(user.role[0])); // Use first role as primary

  const form = useForm<FormData>({
    resolver: zodResolver(userRoleSchema),
    values: {
      role: role,
    },
  });

  const onSubmit = async (data: z.infer<typeof userRoleSchema>) => {
    try {
      setIsPending(true);

      const response = await profileApi.updateProfile({ role: data.role });

      if (response.success && response.content) {
        // Convert enum value to auth role string
        const authRoleString = data.role.toLowerCase();
        updateUserProfile({ role: [authRoleString as any] });
        setUpdated(false);
        toast.success("Your role has been updated.");
      } else {
        toast.error("Something went wrong.", {
          description:
            response.message || "Your role was not updated. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error("Something went wrong.", {
        description:
          error.message || "Your role was not updated. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionColumns
          title="Your Role"
          description="Select the role what you want for test the app."
        >
          <div className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Role</FormLabel>
                  <Select
                    // TODO:(FIX) Option value not update. Use useState for the moment
                    onValueChange={(value: string) => {
                      const enumValue = value as UserRole;
                      setUpdated(mapAuthRoleToEnum(user.role[0]) !== enumValue);
                      setRole(enumValue);
                      field.onChange(enumValue);
                    }}
                    name={field.name}
                    defaultValue={mapAuthRoleToEnum(user.role[0]).toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role.toString()}>
                          {role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={updated ? "default" : "disable"}
              disabled={isPending || !updated}
              className="w-[67px] shrink-0 px-0 sm:w-[130px]"
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>
                  Save
                  <span className="hidden sm:inline-flex">&nbsp;Changes</span>
                </p>
              )}
            </Button>
          </div>
          <div className="flex flex-col justify-between p-1">
            <p className="text-[13px] text-muted-foreground">
              Remove this field on real production
            </p>
          </div>
        </SectionColumns>
      </form>
    </Form>
  );
}
