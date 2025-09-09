import { Models } from "node-appwrite";

export enum TaskStatus {
  BLACKLOG = "BLACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  TODO = "TODO",
  DONE = "DONE",
  IN_REVIEW = "IN_REVIEW",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  assigneeId: string;
  description: string;
  workspaceId: string;
  projectId: string;
  dueDate: string;
};
