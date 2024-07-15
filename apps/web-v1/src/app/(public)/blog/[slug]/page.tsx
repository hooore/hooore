import { redirect } from "next/navigation";
import { Hero } from "@/components/hero";
import { Chip } from "@/components/chip";
import { Divider } from "@/components/divider";
import { Content4 } from "@/components/content4";
import { RelatedContent } from "@/components/related-content";
import { ContentRenderer } from "@/components/content-renderer";
import { getBlogBySlugAction } from "@/actions/blog";
import { formatD_MMMM_YYYY } from "@/utils/date";
import { OutlineText } from "@/components/outline-text";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlogBySlugAction(params.slug);

  if (!blog) {
    return redirect("/not-found");
  }

  return (
    <>
      <Hero
        header={
          blog.tags.length !== 0
            ? blog.tags.map((tag, tagIndex) => {
                return <Chip key={tagIndex}>{tag}</Chip>;
              })
            : undefined
        }
        title={<OutlineText>{blog.title}</OutlineText>}
        description={<OutlineText>{blog.description}</OutlineText>}
        footer={
          <span className="ss-block ss-text-center ss-text-p sm:ss-text-left sm:ss-text-p-sm">
            {`${formatD_MMMM_YYYY(blog.published_date)} • ${blog.viewers} Viewers`}{" "}
          </span>
        }
      />
      <Divider />
      <main className="ss-overflow-scroll">
        <ContentRenderer contents={blog.contents} />
      </main>
      <Divider />
      <Content4
        align="left"
        title="Related Articles"
        content={
          <RelatedContent
            moreLink="/blog"
            moreText="See More Articles"
            prevContent={
              blog && {
                title: blog.title,
                tags: blog.tags,
                meta: `${formatD_MMMM_YYYY(blog.published_date)} • ${blog.viewers} Viewers`,
                thumbnailUrl: blog.thumbnail_url,
                thumbnailAlt: blog.thumbnail_alt,
                link: `/portfolio/${blog.slug}`,
              }
            }
            nextContent={
              blog && {
                title: blog.title,
                tags: blog.tags,
                meta: `${formatD_MMMM_YYYY(blog.published_date)} • ${blog.viewers} Viewers`,
                thumbnailUrl: blog.thumbnail_url,
                thumbnailAlt: blog.thumbnail_alt,
                link: `/portfolio/${blog.slug}`,
              }
            }
          />
        }
      />
    </>
  );
}