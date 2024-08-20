"use server";

import type { Result } from "@/types/result";
import type { ProjectSchema, TemplateSchema } from "./project.definition";
import { sql } from "@/lib/db";
import type { PageSchema } from "./page.definition";
import type { ProjectNavbarSchema } from "./project-navbar.definition";
import type { PageContentSchema } from "./page-content.definition";
import { ADMIN_ROLE } from "./contants";

export async function insertProjectRepo(
  project: ProjectSchema,
  navbars: ProjectNavbarSchema[],
  pages: PageSchema[],
  pageContents: PageContentSchema[],
): Promise<Result<null>> {
  try {
    await sql.begin(async (sql) => {
      await sql`
        INSERT INTO project ${sql(project, "business_logo", "business_name", "domain", "env", "id", "need_publish", "user_id")}`;

      // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
      // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
      // But we get TypeScript error
      await sql`INSERT INTO project_navbar ${sql(navbars, "id", "content", "project_id", "template_content_id")}`;

      await sql`INSERT INTO page ${sql(pages, "id", "name", "slug", "published", "last_edited", "create_date", "type", "project_id", "is_home")}`;

      // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
      // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
      // But we get TypeScript error
      await sql`INSERT INTO page_content ${sql(pageContents, "id", "content", "page_id", "template_content_id", "order")}`;
    });

    return { success: true, data: null };
  } catch {
    return { success: false, error: "IPR: Uncatched error." };
  }
}

export async function getUserProjectsRepo(
  userId: string,
): Promise<Result<ProjectSchema[]>> {
  try {
    const result = await sql<ProjectSchema[]>`
        SELECT
            id,
            domain,
            user_id,
            business_name,
            business_logo
        FROM project p
        WHERE p.user_id = ${userId}
        LIMIT 1
        `;

    return { success: true, data: result };
  } catch {
    return { success: false, error: "GUPsR: Uncatched error." };
  }
}

export async function getUserProjectRepo(
  userId: string,
): Promise<Result<ProjectSchema | undefined>> {
  try {
    const [project] = await sql<[ProjectSchema?]>`
          SELECT
                id,
                domain,
                user_id,
                business_name,
                business_logo,
                need_publish
          FROM project p
          WHERE p.user_id = ${userId}
          LIMIT 1
          `;

    return { success: true, data: project };
  } catch {
    return { success: false, error: "GUPR: Uncatched error." };
  }
}

export async function getProjectByIdRepo(
  projectId: string,
): Promise<Result<ProjectSchema | undefined>> {
  try {
    const [project] = await sql<[ProjectSchema?]>`
            SELECT
                  id,
                  domain,
                  user_id,
                  business_name,
                  business_logo,
                  env
            FROM project
            WHERE id = ${projectId}
            `;

    return { success: true, data: project };
  } catch {
    return { success: false, error: "GPBIR: Uncatched error." };
  }
}

export async function updateProjectRepo(
  project: ProjectSchema,
): Promise<Result<null>> {
  try {
    await sql`
            UPDATE 
                project 
            SET ${sql(project, "business_name", "business_logo", "need_publish")}
            WHERE id = ${project.id}
          `;

    return { success: true, data: null };
  } catch {
    return { success: false, error: "UPR: Uncatched error." };
  }
}

export async function updateProjectPublishRepo(
  projectId: string,
  needPublish: boolean,
): Promise<Result<null>> {
  try {
    await sql`
              UPDATE 
                  project 
              SET need_publish = ${needPublish}
              WHERE id = ${projectId}
            `;

    return { success: true, data: null };
  } catch {
    return { success: false, error: "UPrPR: Uncatched error." };
  }
}

export async function getTemplatesRepo(): Promise<Result<TemplateSchema[]>> {
  try {
    const result = await sql<TemplateSchema[]>`
        SELECT
            pr.id,
            pr.domain as code,
            pr.business_name as name,
            pr.thumbnail as thumbnail_url
        FROM
            project pr
        LEFT JOIN "user" u
            ON u.id = pr.user_id
        WHERE 
            u."role" = ${ADMIN_ROLE}
        `;

    return {
      success: true,
      data: result,
    };
  } catch {
    return {
      success: false,
      error: "GTR: Uncatched error.",
    };
  }
}

export async function updateProjectEnvRepo(
  projectId: string,
  env: Record<string, unknown>,
): Promise<Result<null>> {
  try {
    // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
    // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
    // But we get TypeScript error
    await sql` UPDATE project SET env = ${env} WHERE id = ${projectId}`;

    return { success: true, data: null };
  } catch {
    return { success: false, error: "UPER: Uncatched error." };
  }
}