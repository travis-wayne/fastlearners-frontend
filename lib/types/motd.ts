export type MotdAudience =
  | "all"
  | "app_users"
  | "students"
  | "agents"
  | "guardians"
  | "app_users_students"
  | "admins";

export interface Motd {
  id: number;
  title: string;
  message: string;
  audience?: MotdAudience | null;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface AdminMotd extends Motd {
  updated_at: string;
  created_by: string | number;
}

export interface CreateMotdData {
  title: string;
  message: string;
  audience?: MotdAudience | null;
  is_active: 0 | 1;
  starts_at: string;
  ends_at: string;
}
