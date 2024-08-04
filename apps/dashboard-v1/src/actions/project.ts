"use server";

import { projectSchema, type ProjectState } from "./project.definition";
import { sql } from "@/lib/db";
import { generateId } from "lucia";

function validateAddProjectForm(schema: Record<string, unknown>) {
  const validatedFields = projectSchema.safeParse(schema);

  if (!validatedFields.success) {
    return {
      data: null,
      error: Object.values(validatedFields.error.flatten().fieldErrors)
        .map((errors) => {
          return errors.join(", ");
        })
        .join(", "),
    };
  }

  return { data: validatedFields.data, error: null };
}

export async function addProjectAction(
  userId: string,
  formData: FormData,
): Promise<ProjectState> {
  const validatedAddProjectForm = validateAddProjectForm({
    id: generateId(15),
    business_logo: formData.get("business_logo"),
    business_name: formData.get("business_name"),
    domain: generateId(5),
    user_id: userId,
  });

  if (validatedAddProjectForm.error !== null) {
    return {
      success: false,
      error: validatedAddProjectForm.error,
    };
  }

  const { id, business_logo, business_name, domain, user_id } =
    validatedAddProjectForm.data;

  try {
    await sql<[{ count: number }]>`
        INSERT INTO
            project
            (id, business_name, business_logo, domain, user_id)
        VALUES
            (${id}, ${business_name}, ${business_logo}, ${domain}, ${user_id})
        `;
    return {
      success: true,
      projectId: id,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

export async function countUserProjectAction(userId: string) {
  const result = await sql<[{ count: number }]>`
        SELECT
            COUNT(p.id) as count
        FROM project p
        LEFT JOIN "user" u 
            ON p.user_id = u.id
        WHERE u.id = ${userId}
        `;

  return Number(result[0].count);
}
