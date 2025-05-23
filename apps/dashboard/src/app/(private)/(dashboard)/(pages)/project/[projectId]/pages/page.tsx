import { getPageContentsById } from "@/actions/page";
import type { PageContent } from "@/actions/page.definition";
import {
  getProjectPagesRepo,
  updatePagePublishRepo,
} from "@/actions/page.repository";
import {
  getProjectByIdRepo,
  updateProjectPublishRepo,
} from "@/actions/project.repository";
import { getCurrentSession } from "@/lib/session";
import type { FuncActionState } from "@/types/result";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PageForm } from "./form";

export default async function PagesPage(props: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session } = await getCurrentSession();
  if (!session) {
    return redirect("/login");
  }

  const projectId = (await props.params).projectId;
  const pageIdParam = (await props.searchParams)["page_id"];

  const [project, projectPages] = await Promise.all([
    getProjectByIdRepo(projectId),
    getProjectPagesRepo(session.userId, projectId),
  ]);

  if (!project.success || !project.data) {
    return redirect("/project-setup");
  }

  let pageId: string = "";
  let projectNavbar: PageContent | null = null;
  let pageContents: PageContent[] = [];
  if (typeof pageIdParam === "string") {
    pageId = pageIdParam;
    const _pageContents = await getPageContentsById(
      session.userId,
      projectId,
      pageIdParam
    );

    projectNavbar =
      _pageContents.success && _pageContents.data.navbar
        ? _pageContents.data.navbar
        : null;
    pageContents = _pageContents.success ? _pageContents.data.contents : [];
  }

  return (
    <PageForm
      webBaseUrl={`https://${project.data.business_name_slug}.${process.env.MAIN_HOST_DOMAIN}`}
      project={project.data}
      pageId={pageId}
      pageContents={pageContents}
      projectNavbar={projectNavbar}
      pages={projectPages.success ? projectPages.data : []}
      publishAction={publishAction}
    />
  );
}

async function publishAction(
  projectId: string,
  pageId: string,
  needPublish: boolean
): Promise<FuncActionState> {
  "use server";
  const updatedPage = await updatePagePublishRepo(pageId, needPublish);
  if (!updatedPage.success) {
    return updatedPage;
  }

  const updatedProject = await updateProjectPublishRepo(projectId, true);
  if (!updatedProject.success) {
    return updatedProject;
  }

  revalidatePath("/project/[projectId]", "layout");
  return {
    success: true,
    data: "",
  };
}
