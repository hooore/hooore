import { addProject } from "@/actions/project";
import {
  type ProjectFormSchema,
  validateProjectFormSchema,
} from "@/actions/project.definition";
import {
  getTemplatesRepo,
  getUserProjectsRepo,
} from "@/actions/project.repository";
import { validateRequest } from "@/lib/auth";
import type { FuncActionState } from "@/types/result";
import { redirect } from "next/navigation";
import { ProjectSetupForm } from "./form";

export default async function ProjectSetupPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const projects = await getUserProjectsRepo(user.id);
  if (projects.success && projects.data.length > 0) {
    return redirect("/");
  }

  const templates = await getTemplatesRepo();

  return (
    <ProjectSetupForm
      action={action}
      redirect="/"
      templates={templates.success ? templates.data : []}
      domain={process.env.MAIN_HOST_DOMAIN}
    />
  );
}

async function action(project: ProjectFormSchema): Promise<FuncActionState> {
  "use server";

  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const validatedProject = validateProjectFormSchema(project);
  if (!validatedProject.success) {
    return {
      success: false,
      error: validatedProject.error,
    };
  }

  const result = await addProject(user.id, validatedProject.data);
  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return result;
}
