import { getPageContentsById } from "@/actions/page";
import { updatePageContents } from "@/actions/page-content";
import type { PageContent } from "@/actions/page.definition";
import { validatePreviewSchema } from "@/actions/preview.definition";
import { insertPagePreviewRepo } from "@/actions/preview.repository";
import { getProjectByIdRepo } from "@/actions/project.repository";
import { validateRequest } from "@/lib/auth";
import type { FuncActionState } from "@/types/result";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import PageEditForm from "./form";

export default async function PageEditPate(props: {
  params: Promise<{ projectId: string; pageId: string }>;
}) {
  const { projectId, pageId } = await props.params;
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const [project, pageContents] = await Promise.all([
    getProjectByIdRepo(projectId),
    getPageContentsById(user.id, projectId, pageId),
  ]);

  if (!project.success || !project.data) {
    return redirect("/project-setup");
  }

  return (
    <PageEditForm
      webBaseUrl={`https://${project.data.business_name_slug}.${process.env.MAIN_HOST_DOMAIN}`}
      project={project.data}
      pageId={pageId}
      previewAction={previewAction}
      saveAction={saveAction}
      pageContents={pageContents.success ? pageContents.data.contents : []}
      projectNavbar={
        pageContents.success && pageContents.data.navbar
          ? pageContents.data.navbar
          : null
      }
    />
  );
}

async function previewAction(
  pageId: string,
  pageContents: PageContent[]
): Promise<FuncActionState> {
  "use server";

  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const validatedPreview = validatePreviewSchema({
    id: pageId,
    content: pageContents,
  });
  if (!validatedPreview.success) {
    return {
      success: false,
      error: validatedPreview.error,
    };
  }

  const result = await insertPagePreviewRepo(
    validatedPreview.data.id,
    validatedPreview.data.content
  );
  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    data: "",
    success: true,
  };
}

async function saveAction(
  projectId: string,
  pageId: string,
  editedDate: Date,
  projectNavbar: PageContent | null,
  pageContents: PageContent[]
): Promise<FuncActionState> {
  "use server";

  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const result = await updatePageContents(
    projectId,
    pageId,
    editedDate,
    projectNavbar,
    pageContents.map((pageContent) => {
      return {
        content: pageContent.content,
        template_content_id: pageContent.template_content_id,
      };
    })
  );
  if (!result.success) {
    return result;
  }

  revalidatePath("/page/[pageId]", "layout");

  return {
    data: "",
    success: true,
  };
}
