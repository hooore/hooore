import { getUserProjectRepo } from "@/actions/project.repository";
import { SettingsForm } from "./form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  type ProjectSchema,
  validateProjectFormSchema,
} from "@/actions/project.definition";
import { updateProject } from "@/actions/project";
import type { FuncActionState } from "@/types/result";

export default async function SettingsPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const userProject = await getUserProjectRepo(user.id);
  if (!userProject.success || userProject.data === undefined) {
    return redirect("/project-setup");
  }

  return <SettingsForm project={userProject.data} action={action} />;
}

async function action(project: ProjectSchema): Promise<FuncActionState> {
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

  const result = await updateProject(project.id, validatedProject.data);
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
