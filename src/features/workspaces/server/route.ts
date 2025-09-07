import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddaleware } from "@/lib/session-middlware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post(
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


    console.log("uploadedImageUrl", uploadedImageUrl);

    const worksSpace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({ data: worksSpace });
  }
);

export default app;
