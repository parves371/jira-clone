import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { loginSchema, signUpSchema } from "../shcemas";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    console.log({ email, password });

    return c.json({ email, password });
  })
  .post("signUp", zValidator("json", signUpSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    console.log({ email, password, name });

    return c.json({ email, password, name });
  });

export default app;
