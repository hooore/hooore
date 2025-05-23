import { sql } from "@/lib/db";
import type {
  PageContentSchema,
  SnippetContentSchema,
} from "./page-content.definition";
import type { Result } from "@/types/result";
import { NAVIGATION_TYPE } from "./contants";

export async function getPageSnippetsRepo(
  userId: string,
  search: string,
): Promise<Result<SnippetContentSchema[]>> {
  try {
    const result = await sql<SnippetContentSchema[]>`
        SELECT
            pc.id,
            tc."name",
            tc.slug,
            pc."content",
            pc.template_content_id
        FROM
            page_content pc
        LEFT JOIN
            template_content tc
                ON tc.id = pc.template_content_id
        LEFT JOIN
            page p
                ON p.id = pc.page_id
        LEFT JOIN
            project pr
                ON pr.id = p.project_id
        WHERE
            pr.user_id = ${userId}
            AND tc."name" ILIKE ${search + "%"}
            AND tc.type != ${NAVIGATION_TYPE}
        `;

    return {
      success: true,
      data: result,
    };
  } catch {
    return {
      success: false,
      error: "GPCR: Uncatched error.",
    };
  }
}

export async function insertPageContentsRepo(
  projectId: string,
  pageId: string,
  lastEdited: Date,
  projectNavbar: Omit<PageContentSchema, "order" | "page_id"> | null,
  pageContents: PageContentSchema[],
): Promise<Result<null>> {
  try {
    await sql.begin(async (sql) => {
      await sql`DELETE FROM page_content WHERE page_id = ${pageId}`;

      // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
      // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
      // But we get TypeScript error
      await sql`INSERT INTO page_content ${sql(pageContents, "id", "content", "page_id", "template_content_id", "order")}`;

      if (projectNavbar) {
        // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
        // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
        // But we get TypeScript error
        await sql`
                INSERT INTO
                    project_navbar
                    (id, content, project_id, template_content_id)
                VALUES
                    (${projectNavbar.id}, ${projectNavbar.content}, ${projectId}, ${projectNavbar.template_content_id})
                ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, template_content_id = EXCLUDED.template_content_id
                `;
      }

      await sql`
                UPDATE 
                    page
                SET
                    last_edited = ${lastEdited}
                WHERE id = ${pageId}
                `;

      await sql`
                UPDATE 
                    project 
                SET need_publish = true
                WHERE id = ${projectId}
              `;
    });

    return {
      success: true,
      data: null,
    };
  } catch {
    return {
      success: false,
      error: "IPCR: Uncatched error.",
    };
  }
}

export async function getPageContentsByPageIdsRepo(
  pageIds: string[],
): Promise<Result<PageContentSchema[]>> {
  try {
    const result = await sql<PageContentSchema[]>`
            SELECT
                pc.id,
                pc.content,
                pc.page_id,
                pc.template_content_id,
                pc."order"
            FROM
                page_content pc
            WHERE
                pc.page_id IN ${sql(pageIds)}
            `;

    return {
      success: true,
      data: result,
    };
  } catch {
    return {
      success: false,
      error: "GPCR: Uncatched error.",
    };
  }
}
