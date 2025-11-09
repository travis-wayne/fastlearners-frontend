// lib/types/subjects.ts

export interface Subject {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  name: string; // "JSS1", "JSS2", "SSS1", etc.
}

export interface SubjectsContent {
  subjects: Subject[];
  compulsory_selective_status: "selected" | "pending";
  compulsory_selective: Subject[];
  selective_status: "selected" | "pending";
  selective: Subject[];
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  content: SubjectsContent | null;
  code: number;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  content: null;
  code: number;
  errors?: Record<string, string[]>;
}

