import { deleteProject } from "@/config/project-config";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = async (id: string) => {
  await deleteProject(id);
  revalidatePath("/");
}; 