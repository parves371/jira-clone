import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddaleware } from "@/lib/session-middlware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { workspace } from "@/features/workspaces/types";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddaleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        })
      );

      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete(
    "/:memberId",
    sessionMiddaleware,

    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { memberId } = c.req.param();

      const memberToDelete = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allmembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToDelete.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (
        member.$id !== memberToDelete.$id &&
        member.role !== MemberRole.ADMIN
      ) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allmembers.total === 1) {
        return c.json({ error: "Cannot delete last member" }, 400);
      }

      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberToDelete.$id);

      return c.json({
        data: {
          $id: memberToDelete.$id,
        },
      });
    }
  )
  .patch(
    "/:memberId",
    sessionMiddaleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberToUpdate = await databases.getDocument<workspace>(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allmembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allmembers.total === 1) {
        return c.json({ error: "Cannot dwongrade last member" }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberToUpdate.$id, {
        role,
      });

      return c.json({
        data: {
          $id: memberToUpdate.$id,
        },
      });
    }
  );

export default app;
