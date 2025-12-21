"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Menu, X } from "lucide-react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { Z_INDEX } from "@/config/z-index";
import { cn } from "@/lib/utils";
import { DocsSidebarNav } from "@/components/docs/sidebar-nav";
import { ClientOnly } from "@/components/shared/client-only";
import { Icons } from "@/components/shared/icons";

import { useLockBody } from "@/hooks/use-lock-body";
import { ModeToggle } from "./mode-toggle";

export function NavMobile() {
  const { user, isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  useLockBody(open);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-3 top-3 rounded-full p-2.5 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted sm:right-4 sm:top-4 md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
        style={{ zIndex: Z_INDEX.floatingToggle }}
      >
        {open ? (
          <X className="size-6 text-muted-foreground" />
        ) : (
          <Menu className="size-6 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 hidden w-full overflow-auto bg-background px-5 py-16 lg:hidden",
          open && "block",
        )}
        style={{ zIndex: Z_INDEX.sheetOverlay }}
      >
        <ul className="grid divide-y divide-muted">
          {links &&
            links.length > 0 &&
            links.map(({ title, href }) => (
              <li key={href} className="py-4">
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  {title}
                </Link>
              </li>
            ))}

          <ClientOnly>
            {isAuthenticated && user ? (
              <>
                {user.role.includes("admin") ? (
                  <li className="py-4">
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex w-full font-medium capitalize"
                    >
                      Admin
                    </Link>
                  </li>
                ) : null}

                <li className="py-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex w-full font-medium capitalize"
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="py-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex w-full font-medium capitalize"
                  >
                    Login
                  </Link>
                </li>

                <li className="py-4">
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="flex w-full font-medium capitalize"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ClientOnly>
        </ul>

        {documentation ? (
          <div className="mt-8 block md:hidden">
            <DocsSidebarNav setOpen={setOpen} />
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-end space-x-4">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Icons.gitHub className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <ModeToggle />
        </div>
      </nav>
    </>
  );
}
