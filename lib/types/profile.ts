/**
 * Profile-related types for API responses and form data
 */

export interface ProfilePageData {
  classes: Array<{ name: string }>;
  roles: string[];
  discipline: Array<{ name: string }>;
}

