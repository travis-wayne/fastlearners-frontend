import * as z from "zod"

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

// Email verification schema
export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "Verification code must be 6 digits").max(6),
})

// Create password schema
export const createPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

// Login schema
export const loginSchema = z.object({
  email_phone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

// Verify reset code schema
export const verifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "Reset code must be 6 digits").max(6),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  phone: z.string().optional(),
  school: z.string().optional(),
  class: z.string().optional(),
  date_of_birth: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  role: z.enum(['student', 'parent']).optional(),
})

// Change password schema
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

// Legacy schema for backward compatibility
export const userAuthSchema = registerSchema
