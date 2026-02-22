"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UserAvatar } from "@/components/shared/user-avatar";
import { deleteAccountRequest } from "@/lib/api/profile";

export function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
  isPendingDeletion,
  onSuccess,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
  isPendingDeletion?: boolean;
  onSuccess?: () => void;
}) {
  const pathname = usePathname();
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  type ModalState = "confirm" | "pending";
  const [uiState, setUiState] = useState<ModalState>(
    isPendingDeletion ? "pending" : "confirm"
  );

  // Close modal on route changes
  useEffect(() => {
    setShowDeleteAccountModal(false);
  }, [pathname, setShowDeleteAccountModal]);

  useEffect(() => {
    setUiState(isPendingDeletion ? "pending" : "confirm");
  }, [isPendingDeletion]);

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const data = await deleteAccountRequest();
      onSuccess?.();
      setSuccessMessage(data.message);
      setUiState((prev) => (prev === "confirm" ? "pending" : "confirm"));
      toast.success(data.message || "Request processed successfully");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setDeleting(false);
    }
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
            name: null,
            image: null,
          }}
        />
        <h3 className="text-heading-lg font-semibold sm:text-heading-xl">
          {uiState === "confirm" ? "Delete Account" : "Delete Request Pending"}
        </h3>
        <p className="responsive-text text-center text-muted-foreground">
          {uiState === "confirm" ? (
            <>
              <b>Warning:</b> This will permanently delete your account. Your account will be deleted in 7 days, but you can cancel the request anytime.
            </>
          ) : (
            successMessage ?? "Your account will be deleted in 7 days. You can cancel this request at any time."
          )}
        </p>

        {/* TODO: Use getUserSubscriptionPlan(session.user.id) to display the user's subscription if he have a paid plan */}
      </div>

      {uiState === "confirm" ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleDeleteAccount();
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
      ) : (
        <div className="flex flex-col space-y-component-md bg-accent px-component-md py-component-xl text-left sm:space-y-component-lg sm:px-component-lg md:px-component-xl">
          <Button
            variant="outline"
            disabled={deleting}
            onClick={handleDeleteAccount}
            className="mobile-touch-target h-control-md sm:h-control-lg"
          >
            Cancel Delete Request
          </Button>
        </div>
      )}
    </Modal>
  );
}
