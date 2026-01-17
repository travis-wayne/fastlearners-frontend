import { User } from "@/types";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/shared/icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name" | "avatar">;
}

/**
 * Add cache-busting parameter to avatar URL to prevent stale cached images
 * Uses a timestamp stored in sessionStorage that gets updated when avatar changes
 */
function getAvatarUrlWithCacheBust(url: string | null | undefined): string {
  if (!url) return "";

  // Get or create cache buster timestamp from sessionStorage
  const cacheKey = "avatar-cache-bust";
  let cacheBust = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

  if (!cacheBust) {
    cacheBust = Date.now().toString();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(cacheKey, cacheBust);
    }
  }

  // Add cache buster to URL
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${cacheBust}`;
}

/**
 * Call this function after successfully uploading a new avatar
 * to force all UserAvatar components to refetch the image
 */
export function invalidateAvatarCache(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("avatar-cache-bust", Date.now().toString());
  }
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const avatarSrc = user.avatar || user.image;
  const avatarUrl = getAvatarUrlWithCacheBust(avatarSrc);

  return (
    <Avatar {...props}>
      {avatarUrl ? (
        <AvatarImage
          alt="Picture"
          src={avatarUrl}
          referrerPolicy="no-referrer"
          className="object-cover"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
