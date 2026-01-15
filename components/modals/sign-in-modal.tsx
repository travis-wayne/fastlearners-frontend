"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DialogTitle } from "@/components/ui/dialog";
import { Icons } from "@/components/shared/icons";

export function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [signInClicked, setSignInClicked] = useState(false);

  // Close modal on route changes
  useEffect(() => {
    setShowSignInModal(false);
  }, [pathname, setShowSignInModal]);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <DialogTitle className="sr-only">Sign In</DialogTitle>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-component-md py-component-lg pt-component-xl text-center sm:px-component-lg md:px-component-xl">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10 sm:size-12" />
          </a>
          <h3 className="font-urban text-heading-lg font-bold sm:text-heading-xl">Sign In</h3>
          <p className="responsive-text text-muted-foreground">
            This is strictly for demo purposes - only your email and profile
            picture will be stored.
          </p>
        </div>

        <div className="flex flex-col space-y-component-sm bg-secondary/50 px-component-md py-component-xl sm:space-y-component-md sm:px-component-lg md:px-component-xl">
          <Button
            variant="default"
            className="h-control-md sm:h-control-lg"
            onClick={() => {
              router.push("/auth/register");
            }}
          >
            Create a new account
          </Button>
          <Button
            variant="outline"
            className="h-control-md sm:h-control-lg"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            Sign in with email
          </Button>
        </div>
      </div>
    </Modal>
  );
}
