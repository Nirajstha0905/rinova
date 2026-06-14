import { z } from "zod";

export const studentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().or(z.literal("")),
  last_name: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email"),
  dial_code: z.string().optional(),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.trim().length >= 5, {
      message: "Phone number must be at least 5 characters",
    }),

  date_of_birth: z.string().optional().or(z.literal("")),

  gender: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),

  nationality: z.string().optional().or(z.literal("")),

  passport_number: z.string().optional().or(z.literal("")),
  passport_expiry: z.string().optional().or(z.literal("")),

  preferred_country: z.string().optional().or(z.literal("")),
  preferred_course: z.string().optional().or(z.literal("")),

  status: z.string().default("pending"),
});
