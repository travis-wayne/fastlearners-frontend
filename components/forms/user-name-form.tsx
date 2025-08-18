"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { profileApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/lib/types/auth';

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
}

type FormData = {
  name: string;
};

export function UserNameForm({ user }: UserNameFormProps) {
  const { updateUserProfile } = useAuthStore();
  const [updated, setUpdated] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const checkUpdate = (value) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsPending(true);
      
      const response = await profileApi.updateProfile({ name: data.name });
      
      if (response.success && response.content) {
        updateUserProfile({ name: data.name });
        setUpdated(false);
        toast.success("Your name has been updated.");
      } else {
        toast.error("Something went wrong.", {
          description: response.message || "Your name was not updated. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error("Something went wrong.", {
        description: error.message || "Your name was not updated. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Your Name"
        description="Please enter a display name you are comfortable with."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="flex-1"
            size={32}
            {...register("name")}
            onChange={(e) => checkUpdate(e.target.value)}
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
          {errors?.name && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.name.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">Max 32 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}