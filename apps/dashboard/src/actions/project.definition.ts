import type { Result } from "@/types/result";
import { z } from "zod";
import { zodErrorStringify } from "./utils";

export const businessNameSchema = z
  .string()
  .min(1, { message: "Business name must be 1 or more characters long" })
  .max(25, { message: "Business name must be 25 or fewer characters long" })
  .regex(/^[A-Za-z0-9_.\- ]+$/, {
    message: "Only accept business name with characters A-Z, a-z, and 0-9",
  });

export const projectNameSchema = z.object({
  business_name: businessNameSchema,
});

export type ProjectNameSchema = z.infer<typeof projectNameSchema>;

export const projectLogoSchema = z.object({
  business_logo: z.string(),
});

export type ProjectLogoSchema = z.infer<typeof projectLogoSchema>;

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;

export function validateProjectFormSchema(
  schema: ProjectFormSchema
): Result<ProjectFormSchema> {
  const validatedFields = projectFormSchema.safeParse(schema);

  if (!validatedFields.success) {
    return {
      success: false,
      error: zodErrorStringify(validatedFields.error),
    };
  }

  return { data: validatedFields.data, success: true };
}

export const publicProjectSchema = z
  .object({
    id: z.string().min(1, { message: "Project id is required" }),
    business_name_slug: z
      .string()
      .min(1, { message: "Business name slug is required" }),
    user_id: z.string().min(1, { message: "User id is required" }),
    need_publish: z.boolean(),
  })
  .merge(projectNameSchema)
  .merge(projectLogoSchema);

export type PublicProjectSchema = z.infer<typeof publicProjectSchema>;

export const projectMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  favico: z.string(),
  custom_domain: z.string().optional().default(""),
  use_custom_domain: z.boolean().optional().default(false),
});

export const projectSettingSchema = projectMetaSchema
  .merge(projectNameSchema)
  .merge(projectLogoSchema);

export type ProjectSettingSchema = z.infer<typeof projectSettingSchema>;

export function validateProjectSettingSchema(
  schema: ProjectSettingSchema
): Result<ProjectSettingSchema> {
  const validatedFields = projectSettingSchema.safeParse(schema);

  if (!validatedFields.success) {
    return {
      success: false,
      error: zodErrorStringify(validatedFields.error),
    };
  }

  return { data: validatedFields.data, success: true };
}

export const projectTemplateSchema = z.object({
  project_template_id: z.string(),
});

export type ProjectTemplateSchema = z.infer<typeof projectTemplateSchema>;

export const projectFormSchema = projectNameSchema
  .merge(projectLogoSchema)
  .merge(projectTemplateSchema);

export const projectSchema = z
  .object({
    env: z.object({
      NEXT_PUBLIC_UMAMI_ID: z.string().optional(),
    }),
  })
  .merge(projectMetaSchema)
  .merge(publicProjectSchema);

export type ProjectSchema = z.infer<typeof projectSchema>;

export function validateProjectSchema(
  schema: ProjectSchema
): Result<ProjectSchema> {
  const validatedFields = projectSchema.safeParse(schema);

  if (!validatedFields.success) {
    return {
      success: false,
      error: zodErrorStringify(validatedFields.error),
    };
  }

  return { data: validatedFields.data, success: true };
}

export type TemplateSchema = {
  id: string;
  business_name: string;
  business_name_slug: string;
  thumbnail: string;
};
