import {
  getProjectPagesRepo,
  getPageContentsByIdRepo,
  updatePagePublishRepo,
} from "@/actions/page.repository";
import { PageForm } from "./form";
import type { PageContent } from "@/actions/page.definition";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { FuncActionState } from "@/types/result";
import { revalidatePath } from "next/cache";
import { updateProjectPublishRepo } from "@/actions/project.repository";

export default async function PagesPage(props: {
  params: { projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const projectId = props.params.projectId;
  const pageIdParam = props.searchParams["page_id"];

  const projectPages = await getProjectPagesRepo(user.id, projectId);

  let pageId: string = "";
  let pageContents: PageContent[] | null = null;
  if (typeof pageIdParam === "string") {
    pageId = pageIdParam;
    const _pageContents = await getPageContentsByIdRepo(user.id, pageIdParam);
    pageContents =
      _pageContents.success && _pageContents.data ? _pageContents.data : null;
  }

  return (
    <PageForm
      projectId={projectId}
      pageId={pageId}
      pageContents={pageContents}
      pages={projectPages.success ? projectPages.data : []}
      publishAction={publishAction}
    />
  );
}

async function publishAction(
  projectId: string,
  pageId: string,
  needPublish: boolean,
): Promise<FuncActionState> {
  "use server";
  await updatePagePublishRepo(pageId, needPublish);
  await updateProjectPublishRepo(projectId, true);
  revalidatePath("/project/[projectId]", "layout");
  return {
    success: true,
    data: "",
  };
}
