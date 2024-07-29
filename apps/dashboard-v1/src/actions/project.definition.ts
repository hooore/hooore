import { z } from "zod";

export type ProjectState =
  | { success: true; projectId: string }
  | {
      success: false;
      error: string;
    };

export const businessNameSchema = z
  .string()
  .min(1, { message: "Business name must be 1 or more characters long" })
  .max(25, { message: "Business name must be 25 or fewer characters long" })
  .regex(/^[A-Za-z0-9_.]+$/, {
    message: "Only accept business name with characters A-Z, a-z, and 0-9",
  });

const MB = 1_048_576;

export const businessLogoSchema = z.object({
  size: z.number().lte(5 * MB, { message: "File size maximum 5MB" }),
  type: z.enum(["image/jpeg", "image/png", "image/svg+xml"], {
    message: "Only accept .jpeg, .png, or .svg for the file type",
  }),
});

export const projectSchema = z.object({
  id: z.string().min(1, { message: "Project id is required" }),
  business_name: businessNameSchema,
  business_logo: z.string(),
  template_id: z.string().optional(),
  social: z
    .object({
      type: z.enum(["email", "linkedin", "instagram"], {
        message: "Social media type not allowed",
      }),
      link: z.string(),
    })
    .array(),
  domain: z.string().min(1, { message: "Domain is required" }),
  user_id: z.string().min(1, { message: "User id is required" }),
});

export type ProjectSchema = z.infer<typeof projectSchema>;