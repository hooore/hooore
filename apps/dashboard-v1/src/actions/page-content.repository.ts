import { sql } from "@/lib/db";
import type {
  PageContentSchema,
  PageSnippetSchema,
} from "./page-content.definition";
import type { Result } from "@/types/result";

export async function getPageSnippetsRepo(
  userId: string,
  search: string,
): Promise<Result<PageSnippetSchema[]>> {
  try {
    const result = await sql<PageSnippetSchema[]>`
        SELECT
            pc.id, tc."name", tc.slug, pc."content"
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
  pageId: string,
  pageContents: PageContentSchema[],
): Promise<Result<null>> {
  try {
    await sql.begin(async (sql) => {
      await sql`DELETE FROM page_content WHERE page_id = ${pageId}`;

      // @ts-expect-error to insert JSON data to JSONB column we just need pass the object directly
      // https://github.com/porsager/postgres/issues/556#issuecomment-1433165737
      // But we get TypeScript error
      await sql`INSERT INTO page_content ${sql(pageContents, "id", "content", "page_id", "template_content_id", "order")}`;
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