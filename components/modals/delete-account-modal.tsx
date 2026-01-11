"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UserAvatar } from "@/components/shared/user-avatar";

export function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [deleting, setDeleting] = useState(false);

  // Close modal on route changes
  useEffect(() => {
    setShowDeleteAccountModal(false);
  }, [pathname, setShowDeleteAccountModal]);

  async function deleteAccount() {
    setDeleting(true);
    await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        // delay to allow for the route change to complete
        await new Promise((resolve) =>
          setTimeout(() => {
            logout();
            resolve(null);
          }, 500),
        );
      } else {
        setDeleting(false);
        const error = await res.text();
        throw error;
      }
    });
  }

  return (
    <Modal
      showModal={showDeleteAccountModal}
      setShowModal={setShowDeleteAccountModal}
      className="gap-0"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b px-component-md py-component-lg pt-component-xl sm:px-component-lg md:px-component-xl">
        <UserAvatar
          user={{
            name: user?.name || null,
            image: user?.image || null,
          }}
        />
        <h3 className="text-heading-lg font-semibold sm:text-heading-xl">Delete Account</h3>
        <p className="responsive-text text-center text-muted-foreground">
          <b>Warning:</b> This will permanently delete your account and your
          active subscription!
        </p>

        {/* TODO: Use getUserSubscriptionPlan(session.user.id) to display the user's subscription if he have a paid plan */}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteAccount(), {
            loading: "Deleting account...",
            success: "Account deleted successfully!",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-component-md bg-accent px-component-md py-component-xl text-left sm:space-y-component-lg sm:px-component-lg md:px-component-xl"
      >
        <div>
          <label htmlFor="verification" className="block text-sm sm:text-base">
            To verify, type{" "}
            <span className="font-semibold text-black dark:text-white">
              confirm delete account
            </span>{" "}
            below
          </label>
          <Input
            type="text"
            name="verification"
            id="verification"
            pattern="confirm delete account"
            required
            autoFocus={false}
            autoComplete="off"
            className="mt-component-xs h-control-md w-full border bg-background sm:h-control-lg"
          />
        </div>

        <Button
          variant="destructive"
          disabled={deleting}
          className="mobile-touch-target h-control-md sm:h-control-lg"
        >
          Confirm delete account
        </Button>
      </form>
    </Modal>
  );
}
