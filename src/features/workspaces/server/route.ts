import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddaleware } from "@/lib/session-middlware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACE_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { genrateInviteCode } from "@/lib/utils";

const app = new Hono()

  .get("/", sessionMiddaleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({
        data: {
          documents: [],
          total: 0,
        },
      });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );
    return c.json({ data: workspaces });
  })

  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddaleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");
      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const worksSpace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: genrateInviteCode(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId: worksSpace.$id,
        userId: user.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: worksSpace });
    }
  );

export default app;
