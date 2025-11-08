import * as z from "zod";

// Schema for compulsory subject selection (JSS only)
export const compulsorySchema = z.object({
  subject: z.number().min(1, "Please select a subject"),
});

// Function to get selective schema based on limit (4 for JSS, 5 for SSS)
export const getSelectiveSchema = (limit: number) =>
  z.object({
    subjects: z
      .array(z.number())
      .min(limit, `Please select exactly ${limit} subjects`)
      .max(limit, `Please select exactly ${limit} subjects`)
      .refine((arr) => arr.length === new Set(arr).size, {
        message: "Subjects must be unique",
      }),
  });