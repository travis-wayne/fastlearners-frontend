// lib/validations/subjects.ts

import { z } from "zod";

export const subjectSetupSchema = z.object({
  classId: z.string().min(1, "Class selection is required"),
  termId: z.string().min(1, "Term selection is required"),
  compulsorySelective: z.number().nullable(),
  electiveIds: z.array(z.number()).min(4, "Select at least 4 electives").max(6, "Select at most 6 electives"),
});

export type SubjectSetupFormData = z.infer<typeof subjectSetupSchema>;

// Schema for JSS (requires compulsory selective)
export const jssSubjectSetupSchema = subjectSetupSchema.extend({
  compulsorySelective: z.number().min(1, "Compulsory selective subject is required"),
  electiveIds: z.array(z.number()).length(4, "Select exactly 4 electives"),
}).refine(
  (data) => {
    // Note: coreSubjectIds validation is handled in the form component
    // This ensures electiveIds count is correct
    return true;
  },
  { message: "Invalid subject selection" }
);

// Schema for SSS (no compulsory selective)
// Note: Nigerian curriculum requires 6 electives for SSS (total 9 subjects: 3 core + 6 electives)
export const sssSubjectSetupSchema = subjectSetupSchema.extend({
  compulsorySelective: z.number().nullable(),
  electiveIds: z.array(z.number()).length(6, "Select exactly 6 electives"),
}).refine(
  (data) => {
    // Note: coreSubjectIds validation is handled in the form component
    // This ensures electiveIds count is correct
    return true;
  },
  { message: "Invalid subject selection" }
);

