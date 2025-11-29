"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

import { SignInModal } from "@/components/modals/sign-in-modal";

export const ModalContext = createContext<{
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowSignInModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        setShowSignInModal,
      }}
    >
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
      {children}
    </ModalContext.Provider>
  );
}
