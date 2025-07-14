import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email format"),
});

export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["tr", "en"]),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
