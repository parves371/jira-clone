import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { DATABASE_ID, PROJECTS_ID, WORKSPACE_ID } from "@/config";
import { workspace } from "../workspaces/types";
import { Project } from "./types";

export const getProject = async ({ id }: { id: string }) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    id
  );

  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: project.workspaceId,
  });

  if (!member) return null;

  return project;
};
