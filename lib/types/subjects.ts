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
  compulsory_selective_status: 'selected' | 'pending';
  compulsory_selective: Subject[];
  selective_status: 'selected' | 'pending';
  selective: Subject[];
}

export interface ClassesContent {
  classes: Class[];
}

export type SubjectsResponse =
  | {
      success: true;
      message: string;
      content: SubjectsContent;
      code: 200;
    }
  | {
      success: false;
      message: string;
      content: null;
      code: 401 | 422 | 500;
    };

export type ClassesResponse =
  | {
      success: true;
      message: string;
      content: ClassesContent;
      code: 200;
    }
  | {
      success: false;
      message: string;
      content: null;
      code: 401 | 404 | 500;
    };

export type UpdateResponse =
  | {
      success: true;
      message: string;
      content: null;
      code: 200;
    }
  | {
      success: false;
      message: string;
      content: null;
      code: 400 | 422 | 500;
    };