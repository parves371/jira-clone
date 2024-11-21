import { z } from "zod";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";

import { loginSchema, signUpSchema } from "../shcemas";
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddaleware } from "@/lib/session-middlware";

const app = new Hono()

  .get("/current", sessionMiddaleware, async (c) => {
    const User = c.get("user");

    return c.json({ data: User });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ success: true });
  })
  .post("signUp", zValidator("json", signUpSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ success: true });
  })
  .post("/logout", sessionMiddaleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
