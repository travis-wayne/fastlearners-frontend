"use client";

import { useState, useTransition } from "react";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { profileApi } from "@/lib/api/auth";
import { User, UserRole } from "@/lib/types/auth";
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
  user: Pick<User, "id" | "role">;
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
    const currentRole = user.role[0];
    
    // Guest users can only choose student or guardian (onboarding choice)
    if (currentRole === 'guest') {
      return ['guest', 'student', 'guardian'];
    }
    
    // For development/testing - show current role only for permanent roles
    // In production, remove the role selector entirely for non-guest users
    return [currentRole]; // Users cannot change roles after onboarding
  };
  
  const roles = getAvailableRoles();
  const [role, setRole] = useState(user.role[0]); // Use first role as primary

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
        updateUserProfile({ role: [data.role] });
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
                    onValueChange={(value: UserRole) => {
                      setUpdated(user.role[0] !== value);
                      setRole(value);
                      field.onChange(value);
                    }}
                    name={field.name}
                    defaultValue={user.role[0]}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role.toString()}>
                          {role}
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
