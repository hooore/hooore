import { sql } from "@/lib/db";
import { PageContent } from "@repo/components/types/page-content";

export async function getPagePaths() {
  const pageSlugs = await sql<{ slug: string }[]>`
              SELECT
                  slug
              FROM 
                page
              WHERE
                project_id = ${process.env.PROJECT_ID}
          `;

  const paths = pageSlugs.map((pageSlug) => {
    const slug = pageSlug.slug.split("/");
    slug.shift();

    return { slug };
  });

  return paths;
}

export async function getPage(slugSegments: string[] = []) {
  const slug = slugSegments.length === 0 ? "/" : `/${slugSegments.join("/")}`;

  const pageContents = await sql<PageContent[]>`
              SELECT
                  pc.id,
                  pc."content",
                  tc.slug
              FROM 
                page_content pc
              LEFT JOIN
                template_content tc
                    ON tc.id = pc.template_content_id
              LEFT JOIN
                page p
                    ON p.id = pc.page_id
              WHERE
                p.slug = ${slug}
                AND p.project_id = ${process.env.PROJECT_ID}
              ORDER BY
                "order" ASC
          `;

  return pageContents;
}