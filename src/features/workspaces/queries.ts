import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { workspace } from "./types";

export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return {
      documents: [],
      total: 0,
    };
  }
  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);
  return workspaces;
};
export const getWorkspace = async ({ id }: { id: string }) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: id,
  });

  if (!member) throw new Error("Unauthorized");

  const workspaces = await databases.getDocument<workspace>(
    DATABASE_ID,
    WORKSPACE_ID,
    id
  );
  return workspaces;
};
export const getWorkspaceInfo = async ({ id }: { id: string }) => {
  const { databases } = await createSessionClient();

  const workspaces = await databases.getDocument<workspace>(
    DATABASE_ID,
    WORKSPACE_ID,
    id
  );
  return {
    name: workspaces.name,
  };  
};
