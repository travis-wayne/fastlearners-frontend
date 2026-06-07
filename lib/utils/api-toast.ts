import { toast } from "sonner";

export type ApiResponseType = "success" | "error" | "info" | "warning";

export function showApiToast(type: ApiResponseType | undefined | null, message: string) {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "info":
    default:
      if (type) {
        toast.info(message);
      } else {
        // If type is not provided at all, fallback to a neutral toast or info
        toast(message);
      }
      break;
  }
}
